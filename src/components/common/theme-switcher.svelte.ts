import { getTauriTheme, isTauriApp } from '$lib/runtime/isTauri';
import { mode } from "mode-watcher";

export async function getCurrentMode() {
    const isTauri = await isTauriApp();

    if (isTauri) {
        // Tauri apps default to dark mode, so we need to check the system preference
        const prefersDark = await getTauriTheme().then(theme => theme).catch(() => false);
        return prefersDark ? "dark" : "light";
    } else {
        return mode.current;
    }
}