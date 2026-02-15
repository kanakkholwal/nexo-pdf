
import { degrees, PDFDocument as PDFLibDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { downloadFile, getPDFDocument } from '../utils/helpers';
import { repairPdfFile } from './repair-pdf.js';

// Worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface PageData {
  id: string;
  pdfIndex: number; // Index in pdfDocs array
  pageIndex: number; // Page index within that specific PDF
  rotation: number; // Actual PDF rotation
  visualRotation: number; // CSS rotation
  canvas: HTMLCanvasElement | null; // Cached rendered canvas
  originalPageIndex: number;
  fileName: string;
  isRendered: boolean; // Track if rendering finished
}

type Snapshot = { 
  pages: PageData[]; 
  selectedIds: string[]; 
  splitMarkers: string[]; // Store IDs instead of indices for better persistence
};

class PdfEditorState {
  // State
  pages = $state<PageData[]>([]);
  selectedIds = $state<Set<string>>(new Set());
  splitMarkers = $state<Set<string>>(new Set());
  pdfDocs: PDFLibDocument[] = []; // Non-reactive, internal reference
  
  isRendering = $state(false);
  loadingProgress = $state(0);
  loadingText = $state('');
  
  // History
  private undoStack: Snapshot[] = [];
  private redoStack: Snapshot[] = [];

  constructor() {
    // Initialize things if needed
  }

  // --- Actions ---

  generateId(): string {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  snapshot() {
    const snap: Snapshot = {
      pages: this.pages.map(p => ({ ...p })), // Shallow copy page objects
      selectedIds: Array.from(this.selectedIds),
      splitMarkers: Array.from(this.splitMarkers),
    };
    this.undoStack.push(snap);
    this.redoStack = []; // Clear redo on new action
  }

  restore(snap: Snapshot) {
    this.pages = snap.pages.map(p => ({ ...p }));
    this.selectedIds = new Set(snap.selectedIds);
    this.splitMarkers = new Set(snap.splitMarkers);
  }

  undo() {
    const last = this.undoStack.pop();
    if (last) {
      this.redoStack.push({
        pages: this.pages.map(p => ({ ...p })),
        selectedIds: Array.from(this.selectedIds),
        splitMarkers: Array.from(this.splitMarkers),
      });
      this.restore(last);
    }
  }

  redo() {
    const next = this.redoStack.pop();
    if (next) {
      this.undoStack.push({
        pages: this.pages.map(p => ({ ...p })),
        selectedIds: Array.from(this.selectedIds),
        splitMarkers: Array.from(this.splitMarkers),
      });
      this.restore(next);
    }
  }

  async loadPdfs(files: File[]) {
    if (this.isRendering) return;
    this.snapshot();
    this.isRendering = true;
    this.loadingProgress = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.loadingText = `Processing ${file.name}...`;
        this.loadingProgress = (i / files.length) * 100;

        let arrayBuffer: ArrayBuffer;
        
        // Attempt repair logic
        try {
          const repaired = await repairPdfFile(file);
          arrayBuffer = repaired ? repaired.buffer : await file.arrayBuffer();
        } catch (e) {
          console.warn('Repair failed, using original', e);
          arrayBuffer = await file.arrayBuffer();
        }

        const pdfDoc = await PDFLibDocument.load(arrayBuffer, { ignoreEncryption: true });
        this.pdfDocs.push(pdfDoc);
        const pdfIndex = this.pdfDocs.length - 1;

        // Create proxies for rendering
        const pdfBytes = await pdfDoc.save();
        const pdfjsDoc = await getPDFDocument({ data: new Uint8Array(pdfBytes) }).promise;
        
        const newPages: PageData[] = [];
        for (let j = 0; j < pdfjsDoc.numPages; j++) {
           newPages.push({
             id: this.generateId(),
             pdfIndex,
             pageIndex: j,
             originalPageIndex: j,
             rotation: 0,
             visualRotation: 0,
             canvas: null, // Will be rendered by component on mount
             fileName: file.name,
             isRendered: false
           });
        }
        
        // Svelte 5 array push
        this.pages.push(...newPages);
      }
    } catch (e) {
      console.error(e);
      alert(t('multiTool.failedToLoad'));
    } finally {
      this.isRendering = false;
      this.loadingProgress = 100;
    }
  }

  // --- Page Manipulation ---

  toggleSelection(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    // Trigger reactivity for Set (Svelte 5 Set reactivity is usually fine, 
    // but reassigning ensures it if using deep proxies)
    this.selectedIds = new Set(this.selectedIds); 
  }

  selectAll() {
    this.pages.forEach(p => this.selectedIds.add(p.id));
    this.selectedIds = new Set(this.selectedIds);
  }

  deselectAll() {
    this.selectedIds.clear();
    this.selectedIds = new Set(this.selectedIds);
  }

  rotatePage(id: string, delta: number) {
    this.snapshot();
    const page = this.pages.find(p => p.id === id);
    if (page) {
      page.visualRotation = (page.visualRotation + delta + 360) % 360;
      page.rotation = (page.rotation + delta + 360) % 360;
    }
  }

  bulkRotate(delta: number) {
    if (this.selectedIds.size === 0) return;
    this.snapshot();
    this.pages.forEach(p => {
      if (this.selectedIds.has(p.id)) {
        p.visualRotation = (p.visualRotation + delta + 360) % 360;
        p.rotation = (p.rotation + delta + 360) % 360;
      }
    });
  }

  deletePage(id: string) {
    this.snapshot();
    this.pages = this.pages.filter(p => p.id !== id);
    this.selectedIds.delete(id);
    this.selectedIds = new Set(this.selectedIds);
    this.splitMarkers.delete(id);
    this.splitMarkers = new Set(this.splitMarkers);
  }

  bulkDelete() {
    if (this.selectedIds.size === 0) return;
    this.snapshot();
    this.pages = this.pages.filter(p => !this.selectedIds.has(p.id));
    this.selectedIds.clear();
    this.selectedIds = new Set();
  }

  duplicatePage(id: string) {
    this.snapshot();
    const index = this.pages.findIndex(p => p.id === id);
    if (index === -1) return;
    
    const original = this.pages[index];
    const clone: PageData = {
        ...original,
        id: this.generateId(),
        // Canvas cannot be deep copied easily, component will re-render it
        // Or we can clone the canvas element here if strictly necessary for performance
        canvas: null 
    };
    
    // Insert after
    this.pages.splice(index + 1, 0, clone);
  }

  toggleSplit(id: string) {
     this.snapshot();
     if (this.splitMarkers.has(id)) {
         this.splitMarkers.delete(id);
     } else {
         this.splitMarkers.add(id);
     }
     this.splitMarkers = new Set(this.splitMarkers);
  }

  async addBlankPage() {
    this.snapshot();
    const canvas = document.createElement('canvas');
    canvas.width = 595;
    canvas.height = 842;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 595, 842);
    }

    this.pages.push({
        id: this.generateId(),
        pdfIndex: -1, // Flag for blank
        pageIndex: -1,
        rotation: 0,
        visualRotation: 0,
        canvas: canvas,
        originalPageIndex: -1,
        fileName: 'Blank',
        isRendered: true
    });
  }

  movePage(fromIndex: number, toIndex: number) {
    // No snapshot here usually as drag events trigger often, 
    // or snapshot on drag start/end in component
    const item = this.pages.splice(fromIndex, 1)[0];
    this.pages.splice(toIndex, 0, item);
  }

  reset() {
      this.pages = [];
      this.selectedIds.clear();
      this.splitMarkers.clear();
      this.pdfDocs = [];
      this.undoStack = [];
      this.redoStack = [];
  }
}

export const pdfState = new PdfEditorState();