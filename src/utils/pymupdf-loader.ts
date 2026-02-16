import { wasmStore } from '$stores/wasm-store.svelte';

// Type definitions for PyMuPDF
// (Simplified for brevity, matches your original interface)
export interface PyMuPDFInterface {
    load(): Promise<void>;
    compressPdf(file: Blob, options: any): Promise<{ blob: Blob; compressedSize: number }>;
    // ... other methods
}

let cachedPyMuPDF: any = null;
let loadPromise: Promise<any> | null = null;

export async function loadPyMuPDF(): Promise<any> {
    if (cachedPyMuPDF) return cachedPyMuPDF;
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        // 1. Check Configuration
        if (!wasmStore.isConfigured('pymupdf')) {
            throw new Error('PyMuPDF is not configured. Please enable it in Settings.');
        }
        if (!wasmStore.isConfigured('ghostscript')) {
            throw new Error('Ghostscript is not configured. It is required for PyMuPDF.');
        }

        // 2. Get URLs
        const pymupdfUrl = wasmStore.getUrl('pymupdf')!;
        const gsUrl = wasmStore.getUrl('ghostscript')!;

        const normalizedUrl = pymupdfUrl.endsWith('/') ? pymupdfUrl : `${pymupdfUrl}/`;

        try {
            // 3. Dynamic Import
            const wrapperUrl = `${normalizedUrl}dist/index.js`;

            // @ts-ignore - Dynamic import of external URL
            const module = await import(/* @vite-ignore */ wrapperUrl);

            if (typeof module.PyMuPDF !== 'function') {
                throw new Error('PyMuPDF module did not export expected PyMuPDF class.');
            }

            // 4. Initialize
            cachedPyMuPDF = new module.PyMuPDF({
                assetPath: `${normalizedUrl}assets/`,
                ghostscriptUrl: gsUrl,
            });

            await cachedPyMuPDF.load();

            console.log('[PyMuPDF] Successfully loaded');
            return cachedPyMuPDF;

        } catch (error: any) {
            loadPromise = null;
            throw new Error(`Failed to load PyMuPDF: ${error.message}`);
        }
    })();

    return loadPromise;
}

export function isPyMuPDFAvailable(): boolean {
    return wasmStore.isConfigured('pymupdf') && wasmStore.isConfigured('ghostscript');
}

export function clearPyMuPDFCache(): void {
    cachedPyMuPDF = null;
    loadPromise = null;
}