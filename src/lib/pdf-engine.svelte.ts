import type * as PDFJS from 'pdfjs-dist';

export class PdfEngine {
    // Protected so subclasses (MergeState, SplitState) can access it
    protected pdfjsLib: typeof PDFJS | null = null;

    /**
     * Loads the PDF.js library dynamically and configures the worker.
     * Protected so only this class and its children can use it.
     */
    protected async getPdfJs() {
        if (this.pdfjsLib) return this.pdfjsLib;

        const lib = await import('pdfjs-dist');

        lib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url
        ).toString();
        this.pdfjsLib = lib;
        return lib;
    }

    /**
     * Shared logic to render a PDF page to a canvas.
     * Used by Merge, Split, Organize, etc.
     */
    async renderPageToCanvas(
        canvas: HTMLCanvasElement,
        pdfDocProxy: PDFJS.PDFDocumentProxy,
        pageIndex: number,
        targetWidth: number = 300
    ) {
        if (!pdfDocProxy) return;

        const page = await pdfDocProxy.getPage(pageIndex + 1); // PDF.js is 1-based

        // 1. Calculate Scale
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = targetWidth / unscaledViewport.width;

        // 2. Handle High DPI (Retina)
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale * outputScale });

        // 3. Set Dimensions
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        // CSS handling for sharpness
        canvas.style.width = Math.floor(viewport.width / outputScale) + "px";
        canvas.style.height = Math.floor(viewport.height / outputScale) + "px";

        const context = canvas.getContext('2d');
        if (context) {
            await page.render({
                canvasContext: context,
                viewport: viewport,
                canvas
            }).promise;
        }
    }
}