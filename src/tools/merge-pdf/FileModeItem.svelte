<script lang="ts">
  import { GripVertical, Trash2 } from '@lucide/svelte';
  import type { UploadedFile } from './helper.svelte';

  let { file, onRemove } = $props<{ 
    file: UploadedFile; 
    onRemove: () => void 
  }>();
</script>

<div class="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary/50">
  <div class="drag-handle cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
    <GripVertical size={20} />
  </div>

  <div class="min-w-0 flex-1">
    <div class="truncate font-medium text-foreground" title={file.name}>
      {file.name}
    </div>
    <div class="text-xs text-muted-foreground">
      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.pageCount} Pages
    </div>
  </div>

  <div class="flex flex-col items-end gap-1">
    <label for="range-{file.id}" class="text-[10px] uppercase tracking-wider text-muted-foreground">
      Pages (e.g. 1-3, 5)
    </label>
    <input
      id="range-{file.id}"
      type="text"
      bind:value={file.pageRange}
      placeholder="All"
      class="h-8 w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground/50"
    />
  </div>

  <button 
    onclick={onRemove}
    class="ml-2 rounded-md p-2 text-destructive hover:bg-destructive/10 transition-colors"
    title="Remove file"
  >
    <Trash2 size={18} />
  </button>
</div>