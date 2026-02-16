<script lang="ts">
  import {
    CheckSquare,
    Copy,
    Loader2,
    RotateCcw,
    RotateCw,
    Scissors,
    Square,
    Trash2
  } from '@lucide/svelte';
  import { getContext } from 'svelte';
  import { PDF_STATE_KEY, type PageData, type PdfEditorState } from './helper.svelte';

  const pdfState = getContext<PdfEditorState>(PDF_STATE_KEY);
  let { page, index } = $props<{ page: PageData; index: number }>();

  // Use $state for the bound element
  let canvasEl = $state<HTMLCanvasElement>();
  let isVisible = $state(false);
  let isRendered = $state(false);

  function lazyLoad(node: HTMLElement) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        isVisible = true;
        // Trigger render if canvas is ready
        if (canvasEl) renderCanvas();
        observer.disconnect();
      }
    }, { rootMargin: '200px' });

    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }

  // Reactive effect to render when canvas becomes available
  $effect(() => {
    if (isVisible && canvasEl && !isRendered) {
      renderCanvas();
    }
  });

  async function renderCanvas() {
    if (!canvasEl || isRendered) return;
    await pdfState.renderPageToCanvas(canvasEl, page.pdfIndex, page.pageIndex, page.rotation, 500);
    isRendered = true;
  }

  const isSelected = $derived(pdfState.selectedIds.has(page.id));
  const hasSplit = $derived(pdfState.splitMarkers.has(page.id));
</script>

<div 
  class="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
  class:ring-2={isSelected}
  class:ring-primary={isSelected}
  class:border-primary={isSelected}
  class:border-border={!isSelected}
  data-id={page.id}
  use:lazyLoad
>
  <div class="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-muted/30 p-4">
    {#if !isVisible}
      <div class="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 class="h-6 w-6 animate-spin" />
      </div>
    {:else}
      <canvas 
        bind:this={canvasEl} 
        class="h-full w-full object-contain transition-transform duration-300 ease-in-out shadow-sm"
        style="transform: rotate({page.visualRotation}deg);"
      ></canvas>
    {/if}

    <button 
      class="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 shadow-sm backdrop-blur-md transition-all hover:bg-background group-hover:opacity-100 {isSelected ? 'opacity-100 text-primary' : 'opacity-0 text-muted-foreground'}"
      onclick={(e) => { e.stopPropagation(); pdfState.toggleSelection(page.id); }}
    >
      {#if isSelected}
        <CheckSquare class="h-5 w-5 fill-primary/10" />
      {:else}
        <Square class="h-5 w-5" />
      {/if}
    </button>
  </div>

  <div class="flex items-center justify-between border-t bg-card px-3 py-2 text-xs text-muted-foreground">
    <span class="font-medium">Page {index + 1}</span>
  </div>

  <div class="absolute bottom-10 left-0 right-0 z-20 flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0">
    <div class="flex items-center gap-1 rounded-lg bg-popover/95 px-1.5 py-1 shadow-xl ring-1 ring-border backdrop-blur-sm">
      <button class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" onclick={() => pdfState.rotatePage(page.id, -90)} title="Rotate Left">
        <RotateCcw class="h-4 w-4" />
      </button>
      <button class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" onclick={() => pdfState.rotatePage(page.id, 90)} title="Rotate Right">
        <RotateCw class="h-4 w-4" />
      </button>
      <div class="h-4 w-[1px] bg-border mx-0.5"></div>
      <button class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" onclick={() => pdfState.duplicatePage(page.id)} title="Duplicate">
        <Copy class="h-4 w-4" />
      </button>
      <button class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" onclick={() => pdfState.toggleSplit(page.id)} title="Split After">
        <Scissors class="h-4 w-4" />
      </button>
      <div class="h-4 w-[1px] bg-border mx-0.5"></div>
      <button class="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors" onclick={() => pdfState.deletePage(page.id)} title="Delete">
        <Trash2 class="h-4 w-4" />
      </button>
    </div>
  </div>

  {#if hasSplit}
    <div class="absolute right-0 top-1/2 z-20 -mr-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 shadow-lg ring-4 ring-background" title="Document will split here">
      <Scissors class="h-4 w-4 text-white" />
    </div>
  {/if}
</div>