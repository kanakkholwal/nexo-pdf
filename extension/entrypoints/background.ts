import { defineBackground } from 'wxt/utils/define-background';

const PDF_TOOL_HOSTNAMES = new Set([
  'smallpdf.com',
  'ilovepdf.com',
  'acrobat.adobe.com',
  'pdfcandy.com',
  'pdf24.org',
  'sodapdf.com',
  'pdfforge.org',
]);

function isPdfUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.endsWith('.pdf') || lower.includes('.pdf?') || lower.includes('.pdf#')) return true;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    if (PDF_TOOL_HOSTNAMES.has(hostname)) return true;
  } catch {
    // ignore malformed URLs
  }
  return false;
}

export default defineBackground(() => {
  // Allow toolbar icon click to open the side panel manually too
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

  // Primary detection: watch tab URL changes from the background.
  // This reliably catches Chrome's native PDF viewer (which runs as a
  // chrome-extension:// frame that content scripts cannot enter).
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return;
    const url = tab.url ?? changeInfo.url ?? '';
    if (!url || url.startsWith('chrome://') || url.startsWith('about:')) return;

    if (isPdfUrl(url)) {
      browser.sidePanel.open({ tabId }).catch(() => {});
    }
  });

  // Fallback: content script message for pages where the URL alone is not
  // conclusive (e.g. document.contentType === 'application/pdf' on a generic URL)
  browser.runtime.onMessage.addListener(
    (message: unknown, sender: Browser.runtime.MessageSender) => {
      if (
        typeof message === 'object' &&
        message !== null &&
        (message as Record<string, unknown>).type === 'PDF_DETECTED' &&
        sender.tab?.id != null
      ) {
        browser.sidePanel.open({ tabId: sender.tab.id }).catch(() => {});
      }
    },
  );
});
