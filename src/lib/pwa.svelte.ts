import { browser } from '$app/environment';

type BeforeInstallPromptEvent = Event & {
	readonly platforms: ReadonlyArray<string>;
	prompt: () => Promise<void>;
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export type PwaPlatform = 'ios' | 'android' | 'desktop' | 'unknown';
export type PwaBrowser = 'safari' | 'chromium' | 'firefox' | 'samsung' | 'other';

type PwaState = {
	prompt: BeforeInstallPromptEvent | null;
	installed: boolean;
	platform: PwaPlatform;
	browserKind: PwaBrowser;
	ready: boolean;
};

export const pwa = $state<PwaState>({
	prompt: null,
	installed: false,
	platform: 'unknown',
	browserKind: 'other',
	ready: false
});

function detectPlatform(): PwaPlatform {
	const ua = navigator.userAgent;
	const isIPadOS =
		ua.includes('Macintosh') && typeof document !== 'undefined' && 'ontouchend' in document;
	if (/iPhone|iPad|iPod/i.test(ua) || isIPadOS) return 'ios';
	if (/Android/i.test(ua)) return 'android';
	if (/Windows|Mac|Linux|CrOS/i.test(ua)) return 'desktop';
	return 'unknown';
}

function detectBrowser(): PwaBrowser {
	const ua = navigator.userAgent;
	if (/SamsungBrowser/i.test(ua)) return 'samsung';
	if (/Edg\//.test(ua) || /Chrome\//.test(ua) || /CriOS/.test(ua)) return 'chromium';
	if (/Firefox|FxiOS/i.test(ua)) return 'firefox';
	if (/Safari/.test(ua) && !/Chrome|CriOS|Android/.test(ua)) return 'safari';
	return 'other';
}

function detectInstalled(): boolean {
	if (typeof window === 'undefined') return false;
	const standalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
	const wco = window.matchMedia?.('(display-mode: window-controls-overlay)').matches ?? false;
	const minimal = window.matchMedia?.('(display-mode: minimal-ui)').matches ?? false;
	const iosStandalone =
		typeof navigator !== 'undefined' &&
		(navigator as unknown as { standalone?: boolean }).standalone === true;
	return standalone || wco || minimal || iosStandalone;
}

let setupDone = false;

export function setupPwa(): void {
	if (!browser || setupDone) return;
	setupDone = true;

	pwa.platform = detectPlatform();
	pwa.browserKind = detectBrowser();
	pwa.installed = detectInstalled();
	pwa.ready = true;

	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		pwa.prompt = e as BeforeInstallPromptEvent;
	});

	window.addEventListener('appinstalled', () => {
		pwa.installed = true;
		pwa.prompt = null;
	});

	const mq = window.matchMedia('(display-mode: standalone)');
	const onChange = () => {
		pwa.installed = detectInstalled();
	};
	mq.addEventListener?.('change', onChange);
}

/** True when we have a captured prompt and can trigger the native install dialog. */
export function canInstallNatively(): boolean {
	return pwa.ready && !pwa.installed && pwa.prompt !== null;
}

/** True when the platform requires manual instructions (iOS Safari, Firefox desktop, etc.). */
export function needsManualInstall(): boolean {
	if (!pwa.ready || pwa.installed) return false;
	if (canInstallNatively()) return false;
	return pwa.platform === 'ios' || pwa.browserKind === 'firefox' || pwa.browserKind === 'safari';
}

export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
	if (!pwa.prompt) return 'unavailable';
	const event = pwa.prompt;
	try {
		await event.prompt();
		const { outcome } = await event.userChoice;
		pwa.prompt = null;
		if (outcome === 'accepted') pwa.installed = true;
		return outcome;
	} catch {
		pwa.prompt = null;
		return 'dismissed';
	}
}
