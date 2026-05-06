<script lang="ts">
  import Navbar from "$components/common/navbar.svelte";
  import { Input } from "$components/ui/input";
  import { config } from "$constants/app";
  import { toolsCategories } from "$constants/tools";
  import { cn } from "$lib/utils";
  import { toolList } from "$tools/list";
  import { ArrowUpRight, Search } from "@lucide/svelte";
  import { cubicOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  let searchQuery = $state("");
  let activeCategory = $state<string>("all");

  let normalizedQuery = $derived(searchQuery.trim().toLowerCase());

  let filteredTools = $derived(
    toolList.filter((t) => {
      const matchesQuery =
        !normalizedQuery ||
        t.title.toLowerCase().includes(normalizedQuery) ||
        t.description.toLowerCase().includes(normalizedQuery);
      const matchesCategory =
        activeCategory === "all" || t.category === activeCategory;
      return matchesQuery && matchesCategory;
    })
  );

  let categoryTabs = $derived([
    {
      id: "all",
      name: "All",
      count: toolList.length,
    },
    ...toolsCategories.map((c) => ({
      id: c.id,
      name: c.name,
      count: c.tools?.length ?? 0,
    })),
  ]);
</script>

<div class="flex h-screen w-full flex-col overflow-hidden">
  <Navbar />

  <main class="flex-1 overflow-y-auto pt-20">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:px-10 lg:py-14">
      <header
        class="flex flex-col gap-5 border-b border-border/60 pb-8"
        in:fly={{ y: 10, duration: 480, easing: cubicOut }}
      >
        <span
          class="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary"
        >
          Workspace
        </span>
        <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div class="flex flex-col gap-2">
            <h1
              class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Welcome to {config.appName}.
            </h1>
            <p class="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Pick a tool. Drop a file. Everything stays on this machine.
            </p>
          </div>

          <div class="relative w-full lg:w-80">
            <Search
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search tools…"
              bind:value={searchQuery}
              class="h-10 rounded-sm pl-9 pr-12 font-mono text-sm placeholder:font-mono placeholder:text-muted-foreground/60"
            />
            <kbd
              class="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-xs border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70 lg:inline-block"
            >
              /
            </kbd>
          </div>
        </div>
      </header>

      <nav
        class="flex flex-wrap items-center gap-1"
        in:fly={{ y: 8, duration: 480, delay: 80, easing: cubicOut }}
      >
        {#each categoryTabs as tab (tab.id)}
          <button
            type="button"
            onclick={() => (activeCategory = tab.id)}
            aria-pressed={activeCategory === tab.id}
            class={cn(
              "group inline-flex items-center gap-2 rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200",
              activeCategory === tab.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span>{tab.name}</span>
            <span
              class={cn(
                "tabular-nums text-[10px]",
                activeCategory === tab.id
                  ? "text-primary/70"
                  : "text-muted-foreground/50"
              )}
            >
              {String(tab.count).padStart(2, "0")}
            </span>
          </button>
        {/each}
      </nav>

      <section
        in:fly={{ y: 10, duration: 480, delay: 140, easing: cubicOut }}
      >
        <div
          class="mb-6 flex items-baseline justify-between border-b border-border/60 pb-3"
        >
          <span
            class="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            {activeCategory === "all"
              ? "All tools"
              : toolsCategories.find((c) => c.id === activeCategory)?.name}
          </span>
          <span
            class="font-mono text-[11px] tabular-nums text-muted-foreground/50"
          >
            {String(filteredTools.length).padStart(2, "0")} / {String(toolList.length).padStart(2, "0")}
          </span>
        </div>

        {#if filteredTools.length === 0}
          <div
            class="flex flex-col items-center gap-3 rounded-md border border-border/60 bg-muted/20 px-6 py-16 text-center"
          >
            <Search class="size-5 text-muted-foreground/50" />
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              No matches
            </p>
            <p class="max-w-xs text-sm text-muted-foreground">
              Nothing found for
              <span class="font-mono text-foreground">"{searchQuery}"</span>.
              Try a different keyword or clear the filter.
            </p>
            <button
              type="button"
              onclick={() => {
                searchQuery = "";
                activeCategory = "all";
              }}
              class="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80"
            >
              Reset filters
              <ArrowUpRight class="size-3" />
            </button>
          </div>
        {:else}
          <ul
            class="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {#each filteredTools as tool, i (tool.slug)}
              {@const Icon = tool.icon}
              <li>
                <a
                  href={`/tools/${tool.slug}`}
                  class="group flex h-full flex-col gap-4 bg-card p-5 transition-colors duration-300 hover:bg-muted/40"
                  in:fly={{
                    y: 8,
                    duration: 360,
                    delay: 40 + (i % 12) * 30,
                    easing: cubicOut,
                  }}
                >
                  <div class="flex items-start justify-between gap-3">
                    <span
                      class="inline-flex size-8 items-center justify-center rounded-sm bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"
                    >
                      {#if Icon}
                        <Icon size={16} />
                      {/if}
                    </span>
                    <span
                      class="font-mono text-[10px] tabular-nums text-muted-foreground/50"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div class="flex flex-1 flex-col gap-1.5">
                    <h3
                      class="text-base font-medium tracking-tight text-foreground"
                    >
                      {tool.title}
                    </h3>
                    <p
                      class="line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                    >
                      {tool.description}
                    </p>
                  </div>

                  <div
                    class="flex items-center justify-between border-t border-border/40 pt-3"
                  >
                    <span
                      class="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 transition-colors group-hover:text-primary"
                    >
                      Open
                    </span>
                    <ArrowUpRight
                      class="size-3.5 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </section>
    </div>
  </main>
</div>
