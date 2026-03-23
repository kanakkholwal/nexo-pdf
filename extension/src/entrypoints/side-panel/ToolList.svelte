<script lang="ts">
  import { toolList, toolsByCategory, CATEGORY_LABELS } from '../../tools/manifest';
  import type { ExtToolConfig } from '../../tools/manifest';
  import { getIcon } from '../../tools/icons';

  interface Props {
    search: string;
    orbitUrl: string;
  }

  const { search, orbitUrl }: Props = $props();

  const filtered = $derived(
    (() => {
      const q = search.trim().toLowerCase();
      if (!q) return null;
      return toolList.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keywords?.some((k) => k.includes(q)),
      );
    })(),
  );

  function openTool(slug: string) {
    window.open(`${orbitUrl}/tools/${slug}`, '_blank', 'noopener,noreferrer');
  }
</script>

{#if filtered !== null && filtered.length === 0}
  <div class="flex flex-col items-center justify-center gap-2 py-12 text-center">
    <p class="text-sm text-[var(--muted-foreground)]">No tools match "{search}"</p>
  </div>
{:else if filtered !== null}
  <!-- Flat search results -->
  <div class="flex flex-col gap-1 px-3 pt-3">
    {#each filtered as tool (tool.slug)}
      {@render toolCard(tool)}
    {/each}
  </div>
  <div class="h-3"></div>
{:else}
  <!-- Grouped by category -->
  {#each Object.entries(toolsByCategory) as [category, tools]}
    <div class="px-3 pt-3">
      <p class="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        {CATEGORY_LABELS[category as ExtToolConfig['category']] ?? category}
      </p>
      <div class="flex flex-col gap-1">
        {#each tools as tool (tool.slug)}
          {@render toolCard(tool)}
        {/each}
      </div>
    </div>
  {/each}
  <div class="h-3"></div>
{/if}

{#snippet toolCard(tool: ExtToolConfig)}
  {@const Icon = getIcon(tool.iconName)}
  <button
    type="button"
    onclick={() => openTool(tool.slug)}
    class="group flex w-full items-start gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2.5 text-left transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--muted)] cursor-pointer"
  >
    <span class="mt-0.5 shrink-0 {tool.color}">
      {#if Icon}
        <Icon size={15} />
      {:else}
        <span class="inline-block size-[15px]"></span>
      {/if}
    </span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-xs font-medium">{tool.title}</p>
      <p class="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-[var(--muted-foreground)]">
        {tool.description}
      </p>
    </div>
    <span class="mt-0.5 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100">
      ↗
    </span>
  </button>
{/snippet}
