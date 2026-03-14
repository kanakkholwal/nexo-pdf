import { BaseEngine } from '$lib/base-engine.svelte';
import { formatBytes } from '$utils/helper';
import { createPluginRegistration, type PluginRegistry } from '@embedpdf/core';
import { usePdfiumEngine } from '@embedpdf/engines/svelte';
import {
  DocumentManagerPluginPackage,
  type DocumentManagerPlugin,
} from '@embedpdf/plugin-document-manager/svelte';
import { ExportPluginPackage, type ExportPlugin } from '@embedpdf/plugin-export/svelte';
import { InteractionManagerPluginPackage } from '@embedpdf/plugin-interaction-manager/svelte';
import { PanPluginPackage } from '@embedpdf/plugin-pan/svelte';
import { RenderPluginPackage } from '@embedpdf/plugin-render/svelte';
import { RotatePluginPackage } from '@embedpdf/plugin-rotate/svelte';
import { ScrollPluginPackage, ScrollStrategy } from '@embedpdf/plugin-scroll/svelte';
import { SelectionPluginPackage } from '@embedpdf/plugin-selection/svelte';
import { TilingPluginPackage } from '@embedpdf/plugin-tiling/svelte';
import { ViewportPluginPackage } from '@embedpdf/plugin-viewport/svelte';
import { ZoomMode, ZoomPluginPackage } from '@embedpdf/plugin-zoom/svelte';
import { toast } from 'svelte-sonner';

export interface EditorFile {
  id: string;
  file: File;
  name: string;
  size: string;
}

export interface EditPdfStateData {
  files: EditorFile[];
  pendingFiles: File[];
  activeDocId: string | null;
  isLoading: boolean;
}

export class EditPdfState extends BaseEngine {
  state = $state<EditPdfStateData>({
    files: [],
    pendingFiles: [],
    activeDocId: null,
    isLoading: false,
  });

  pdfEngine = usePdfiumEngine({
    wasmUrl: '/wasm/pdfium.wasm',
    worker: true,
  });

  plugins = [
    createPluginRegistration(DocumentManagerPluginPackage, { maxDocuments: 10 }),
    createPluginRegistration(ViewportPluginPackage, { viewportGap: 10 }),
    createPluginRegistration(ScrollPluginPackage, {
      defaultStrategy: ScrollStrategy.Vertical,
    }),
    createPluginRegistration(RenderPluginPackage),
    createPluginRegistration(TilingPluginPackage, {
      tileSize: 768,
    }),
    createPluginRegistration(ZoomPluginPackage, {
      defaultZoomLevel: ZoomMode.FitPage,
    }),
    createPluginRegistration(ExportPluginPackage),
    createPluginRegistration(RotatePluginPackage),
    createPluginRegistration(PanPluginPackage),
    createPluginRegistration(InteractionManagerPluginPackage),
    createPluginRegistration(SelectionPluginPackage),
  ];

  // Stored after onInitialized fires — accessed inline like the official example
  private registry: PluginRegistry | null = null;

  async handleInitialized(registry: PluginRegistry) {
    this.registry = registry;
    console.log('[EmbedPDF] handleInitialized fired, registry:', registry);

    const docManager = registry
      .getPlugin<DocumentManagerPlugin>('document-manager')
      ?.provides();

    console.log('[EmbedPDF] docManager:', docManager);
    console.log('[EmbedPDF] docManager methods:', docManager ? Object.keys(docManager) : 'null');

    if (!docManager) {
      console.error('[EmbedPDF] Document manager plugin not available after initialization');
      return;
    }

    docManager.onDocumentOpened((doc: any) => {
      console.log('[EmbedPDF] onDocumentOpened fired, doc:', doc);
      this.state.activeDocId = doc?.id ?? null;
    });

    console.log('[EmbedPDF] pendingFiles count:', this.state.pendingFiles.length);
    if (this.state.pendingFiles.length > 0) {
      const queue = this.state.pendingFiles.splice(0);
      await this.openFiles(docManager, queue);
    }
  }

  queueFiles(files: File[]) {
    this.state.pendingFiles.push(...files);
  }

  async addFiles(files: File[]) {
    const docManager = this.registry
      ?.getPlugin<DocumentManagerPlugin>('document-manager')
      ?.provides();

    if (!docManager) {
      // Engine not ready yet — queue for later
      this.queueFiles(files);
      return;
    }

    await this.openFiles(docManager, files);
  }

  private async openFiles(docManager: any, files: File[]) {
    this.state.isLoading = true;
    try {
      for (const file of files) {
        await this.openDocument(docManager, file);
      }
    } catch (e) {
      console.error('Error opening files:', e);
      toast.error('Failed to add one or more PDF files.');
    } finally {
      this.state.isLoading = false;
    }
  }

  private async openDocument(docManager: any, file: File) {
    try {
      const buffer = await file.arrayBuffer();
      console.log('[EmbedPDF] calling openDocumentBuffer for:', file.name);

      const docInfo = await Promise.race([
        docManager.openDocumentBuffer({ buffer, name: file.name, autoActivate: true }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout opening "${file.name}"`)), 15_000),
        ),
      ]);

      console.log('[EmbedPDF] openDocumentBuffer result:', docInfo);
      const docId: string = (docInfo as any)?.id ?? docInfo;
      console.log('[EmbedPDF] resolved docId:', docId);
      if (!docId) throw new Error('No document ID returned');

      // Explicitly activate to ensure UI sync
      await docManager.setActiveDocument(docId);
      this.state.activeDocId = docId;

      this.state.files.push({
        id: docId,
        file,
        name: file.name,
        size: formatBytes(file.size),
      });
    } catch (e) {
      console.error('Failed to open file', file.name, e);
      toast.error(`Failed to open ${file.name}: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  async activateDocument(id: string) {
    const docManager = this.registry
      ?.getPlugin<DocumentManagerPlugin>('document-manager')
      ?.provides();

    if (docManager) {
      await docManager.setActiveDocument(id);
    }
    this.state.activeDocId = id;
  }

  async closeDocument(id: string) {
    const docManager = this.registry
      ?.getPlugin<DocumentManagerPlugin>('document-manager')
      ?.provides();

    if (docManager) {
      await docManager.closeDocument(id);
    }

    this.state.files = this.state.files.filter((f) => f.id !== id);
    if (this.state.activeDocId === id) {
      this.state.activeDocId = this.state.files.at(-1)?.id ?? null;
    }
  }

  async downloadActivePdf() {
    if (!this.state.activeDocId) return;

    // Get raw plugin (not capability) — then call provides(docId) to scope to document
    const exportPlugin = this.registry?.getPlugin<ExportPlugin>('export');

    if (!exportPlugin) return;

    this.state.isLoading = true;
    try {
      const activeDocId = this.state.activeDocId!;
      const arrayBuffer = await exportPlugin.provides(activeDocId).saveAsCopy().toPromise();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const activeFile = this.state.files.find((f) => f.id === activeDocId);
      const name = activeFile ? `edited_${activeFile.name}` : 'edited_document.pdf';
      this.downloadBlob(blob, name);
    } catch (e) {
      console.error(e);
      toast.error('Failed to download PDF.');
    } finally {
      this.state.isLoading = false;
    }
  }
}