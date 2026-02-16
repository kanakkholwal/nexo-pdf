import { PdfEngine } from '$lib/pdf-engine.svelte';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import type * as PDFJS from 'pdfjs-dist';

export const SPLIT_STATE_KEY = Symbol('SPLIT_STATE');

export type SplitMode = 'range' | 'extract' | 'visual' | 'n-times' | 'bookmarks';

export class SplitState extends PdfEngine {
  file = $state<File | null>(null);
  fileName = $state('');
  pageCount = $state(0);
  pdfDoc: PDFDocument | null = null;

  // UI States
  mode = $state<SplitMode>('range');
  isProcessing = $state(false);
  progress = $state({ text: '', percent: 0 });

  // Mode Specific Inputs
  rangeInput = $state(''); // e.g. "1-5, 8"
  nTimesValue = $state(2); // Split every N pages
  selectedPages = $state<Set<number>>(new Set()); // For Visual Mode

  private pdfJsDoc: PDFJS.PDFDocumentProxy | null = null;



  async loadFile(newFile: File) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.progress = { text: 'Loading PDF...', percent: 10 };

    try {
      const arrayBuffer = await newFile.arrayBuffer();

      // 1. Load pdf-lib (for splitting)
      this.pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      this.pageCount = this.pdfDoc.getPageCount();

      // 2. Load PDF.js (for thumbnails)
      const pdfjs = await this.getPdfJs();
      const loadingTask = pdfjs.getDocument(new Uint8Array(arrayBuffer.slice(0)));
      this.pdfJsDoc = await loadingTask.promise;

      this.file = newFile;
      this.fileName = newFile.name;
      this.selectedPages.clear();
      this.rangeInput = '';

    } catch (error) {
      console.error(error);
      alert("Failed to load PDF. It might be password protected or corrupted.");
    } finally {
      this.isProcessing = false;
    }
  }

  async renderThumbnail(canvas: HTMLCanvasElement, pageIndex: number) {
    if (!this.pdfJsDoc) return;
    const page = await this.pdfJsDoc.getPage(pageIndex + 1);

    // Low-res thumbnail logic
    const viewport = page.getViewport({ scale: 1 });
    const scale = 200 / viewport.width;
    const scaledViewport = page.getViewport({ scale });
    const outputScale = window.devicePixelRatio || 1;

    canvas.width = Math.floor(scaledViewport.width * outputScale);
    canvas.height = Math.floor(scaledViewport.height * outputScale);
    canvas.style.width = Math.floor(scaledViewport.width) + "px";
    canvas.style.height = Math.floor(scaledViewport.height) + "px";

    const ctx = canvas.getContext('2d');
    if (ctx) {
      await page.render({
        canvasContext: ctx,
        viewport: scaledViewport,
        transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
        canvas
      }).promise;
    }
  }

  togglePageSelection(index: number) {
    if (this.selectedPages.has(index)) {
      this.selectedPages.delete(index);
    } else {
      this.selectedPages.add(index);
    }
    this.selectedPages = new Set(this.selectedPages); // Reactivity trigger
  }

  // --- Split Logic ---

  async processSplit() {
    if (!this.pdfDoc || !this.file) return;
    this.isProcessing = true;
    this.progress = { text: 'Splitting...', percent: 0 };

    try {
      if (this.mode === 'range') {
        await this.splitByRange();
      } else if (this.mode === 'visual' || this.mode === 'extract') {
        await this.splitBySelection();
      } else if (this.mode === 'n-times') {
        await this.splitNTimes();
      }
      // Add 'bookmarks' logic if needed later (requires complex parsing)
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Error splitting PDF");
    } finally {
      this.isProcessing = false;
    }
  }

  private async splitByRange() {
    const indices = this.parsePageRange(this.rangeInput, this.pageCount);
    if (indices.length === 0) throw new Error("Invalid page range");

    // Extract specific pages into ONE new file (Standard "Extract" behavior)
    // Or if the user wanted separate files per range, logic differs. 
    // Usually "Split by Range" implies extracting those pages.
    await this.extractPages(indices, `split_${this.fileName}`);
  }

  private async splitBySelection() {
    const indices = Array.from(this.selectedPages).sort((a, b) => a - b);
    if (indices.length === 0) throw new Error("No pages selected");
    await this.extractPages(indices, `selected_${this.fileName}`);
  }

  private async splitNTimes() {
    const n = Math.max(1, Math.floor(this.nTimesValue));
    const zip = new JSZip();
    const total = this.pageCount;
    const numChunks = Math.ceil(total / n);

    this.progress = { text: 'Creating chunks...', percent: 10 };

    for (let i = 0; i < numChunks; i++) {
      const start = i * n;
      const end = Math.min(start + n, total);

      // Create new PDF for this chunk
      const newPdf = await PDFDocument.create();
      const indices = Array.from({ length: end - start }, (_, k) => start + k);
      const copiedPages = await newPdf.copyPages(this.pdfDoc!, indices);
      copiedPages.forEach(p => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      zip.file(`part_${i + 1}.pdf`, pdfBytes);

      this.progress = { text: `Processing part ${i + 1}/${numChunks}`, percent: 10 + ((i / numChunks) * 80) };
    }

    const content = await zip.generateAsync({ type: "blob" });
    this.downloadBlob(content, `split_every_${n}_pages.zip`);
  }

  private async extractPages(indices: number[], filename: string) {
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(this.pdfDoc!, indices);
    copiedPages.forEach(p => newPdf.addPage(p));

    const pdfBytes = await newPdf.save();
    this.downloadBlob(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }), filename);
  }

  private parsePageRange(rangeStr: string, maxPages: number): number[] {
    const indices = new Set<number>();
    const parts = rangeStr.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, start);
          const e = Math.min(maxPages, end);
          for (let i = s; i <= e; i++) indices.add(i - 1);
        }
      } else {
        const p = Number(trimmed);
        if (!isNaN(p) && p >= 1 && p <= maxPages) indices.add(p - 1);
      }
    }
    return Array.from(indices);
  }

  private downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  reset() {
    this.file = null;
    this.pdfDoc = null;
    this.pdfJsDoc = null;
    this.rangeInput = '';
    this.selectedPages.clear();
  }
}