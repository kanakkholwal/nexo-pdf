import { defineBackground } from 'wxt/utils/define-background';

export default defineBackground(() => {
  // Allow the side panel to be opened programmatically by the background
  // service worker (required by Chrome's side panel API).
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch(() => {
      // Older Chrome builds without this API — safe to ignore.
    });

  browser.runtime.onMessage.addListener(
    (message: unknown, sender: chrome.runtime.MessageSender) => {
      if (
        typeof message === 'object' &&
        message !== null &&
        (message as Record<string, unknown>).type === 'PDF_DETECTED' &&
        sender.tab?.id != null
      ) {
        const tabId = sender.tab.id;

        // Open the side panel for this specific tab only — does not affect
        // other tabs the user has open.
        browser.sidePanel.open({ tabId }).catch(() => {
          // sidePanel.open can fail if the tab is navigating; ignore.
        });
      }
    },
  );
});
