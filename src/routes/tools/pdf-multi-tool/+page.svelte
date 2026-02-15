<script lang="ts">
  import {
    CheckSquare,
    Download,
    FilePlus,
    Loader2,
    Redo2,
    RotateCcw,
    RotateCw,
    Square,
    Trash2,
    Undo2,
    UploadCloud,
    X
  } from '@lucide/svelte';
</script>

  <div id="main-scroll-container" class="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-8 pb-32">
    
    <div
      id="upload-area"
      class="group mx-auto mt-20 flex max-w-xl cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/40 p-16 text-center backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-card/60"
    >
      <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary/10">
        <UploadCloud size={40} strokeWidth={1.5} />
      </div>
      <h3 class="mb-2 text-2xl font-bold text-foreground">Upload PDF</h3>
      <p class="mb-8 max-w-xs text-muted-foreground">Drag & drop your files here, or click to browse from your device.</p>
      
      <button class="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-foreground shadow-lg transition-transform active:scale-95 hover:bg-muted/80">
        Select Files
      </button>
      
      <input type="file" id="pdf-file-input" accept="application/pdf" multiple class="hidden" />
    </div>

    <div id="pages-container" class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      </div>
  </div>

  <div class="fixed bottom-8 left-1/2 z-40 -translate-x-1/2">
    <div class="flex items-center gap-1 rounded-2xl border border-border/60 bg-card/80 px-2 py-2 shadow-xl backdrop-blur-xl ring-1 ring-black/5">
      
      <div class="flex items-center gap-1 border-r border-border/60 pr-2 mr-1">
        <button id="upload-pdfs-btn" class="toolbar-btn-primary" title="Add PDF">
           <UploadCloud size={18} />
           <span class="hidden sm:inline ml-2">Add</span>
        </button>
        <button id="add-blank-page-btn" class="toolbar-btn" title="Add Blank">
           <FilePlus size={18} />
        </button>
      </div>

      <div class="flex items-center gap-1 border-r border-border/60 pr-2 mr-1">
        <button id="undo-btn" class="toolbar-btn" title="Undo">
           <Undo2 size={18} />
        </button>
        <button id="redo-btn" class="toolbar-btn" title="Redo">
           <Redo2 size={18} />
        </button>
      </div>

      <div class="flex items-center gap-1 border-r border-border/60 pr-2 mr-1">
        <button id="bulk-rotate-left-btn" class="toolbar-btn" title="Rotate Left">
           <RotateCcw size={18} />
        </button>
        <button id="bulk-rotate-btn" class="toolbar-btn" title="Rotate Right">
           <RotateCw size={18} />
        </button>
        <button id="bulk-delete-btn" class="toolbar-btn text-red-500 hover:bg-red-50 hover:text-red-600" title="Delete Selected">
           <Trash2 size={18} />
        </button>
      </div>

      <div class="hidden md:flex items-center gap-1 border-r border-border/60 pr-2 mr-1">
         <button id="select-all-btn" class="toolbar-btn" title="Select All">
            <CheckSquare size={18} />
         </button>
         <button id="deselect-all-btn" class="toolbar-btn" title="Deselect">
            <Square size={18} />
         </button>
      </div>

      <button id="export-pdf-btn" class="ml-1 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-foreground shadow-md transition-transform active:scale-95 hover:bg-slate-800">
         <Download size={16} />
         <span>Export</span>
      </button>

    </div>
  </div>


<div id="loading-overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md hidden">
  <div class="flex flex-col items-center rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
    <Loader2 class="h-10 w-10 animate-spin text-blue-500 mb-4" />
    <h3 class="text-lg font-semibold text-slate-800 mb-2">Processing Documents</h3>
    <p id="loading-text" class="text-sm text-slate-500 mb-6">Rendering pages for high-fidelity preview...</p>
    
    <div class="h-2 w-64 overflow-hidden rounded-full bg-slate-100">
      <div id="loading-progress" class="h-full bg-blue-500 transition-all duration-300" style="width: 0%"></div>
    </div>
  </div>
</div>

<div id="modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm hidden">
  <div class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 mx-4">
    <button id="modal-close-icon" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
      <X size={20} />
    </button>
    
    <div class="flex flex-col items-center text-center">
      <div id="modal-icon" class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
         </div>
      <h3 id="modal-title" class="mb-2 text-lg font-bold text-slate-900">Error</h3>
      <p id="modal-message" class="mb-6 text-sm text-slate-500 leading-relaxed">Something went wrong.</p>
      
      <button id="modal-close-btn" class="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200">
        Dismiss
      </button>
    </div>
  </div>
</div>

<input type="file" id="insert-pdf-input" accept="application/pdf" class="hidden" />

<style>
    @reference "tailwindcss";
  /* Toolbar Button Utility Class */
  .toolbar-btn {
    @apply flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200;
  }
  .toolbar-btn-primary {
    @apply flex h-9 px-3 items-center justify-center rounded-lg text-blue-600 bg-blue-50 font-medium transition-colors hover:bg-blue-100 active:bg-blue-200;
  }
</style>




<svelte:head>
    <title>PDF Multi Tool - PDF Tools</title>
    <meta name="description" content="Combine, split, compress, and convert PDFs with our powerful PDF Multi Tool. All processing happens locally in your browser for maximum privacy." />
    <meta name="keywords" content="PDF, PDF tools, PDF editor, PDF converter, PDF compressor, PDF splitter, PDF merger, client-side PDF, offline PDF" />
</svelte:head>


