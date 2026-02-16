<script lang="ts">
  import { page } from "$app/state";
  import Button from "$components/ui/button/button.svelte";
  import * as Sidebar from "$components/ui/sidebar";
  import { categories, tools } from "$constants/tools";
  import { cn } from "$lib/utils";
  import { Command, Moon, Sparkles, Sun } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";

  // Derived state for reactivity
  let currentPath = $derived(page.url.pathname);

  // Helper for active state checking
  function isActive(path: string) {
    return currentPath.startsWith(path);
  }
</script>

<Sidebar.Root
  class="hidden w-70 flex-col border-r border-border/40 bg-sidebar backdrop-blur-xl md:flex"
>
  <Sidebar.Header class="flex h-16 shrink-0 items-center px-6 justify-between flex-row">
    <a
      href="/"
      class="group flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <div
        class="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shadow-inner ring-1 ring-primary/20 transition-all group-hover:bg-primary/20"
      >
        <Command class="h-4 w-4 text-primary" />
        <div
          class="absolute inset-0 rounded-lg bg-primary/20 blur opacity-0 transition-opacity group-hover:opacity-100"
        ></div>
      </div>
      <div class="flex flex-col">
        <span class="text-sm font-bold tracking-tight text-foreground"
          >NexoPDF</span
        >
        <span class="text-[10px] font-medium text-muted-foreground"
          >Pro Suite</span
        >
      </div>
    </a>
    <Button
      variant="ghost"
      size="icon"
      onclick={toggleMode}
      class="rounded-full hidden md:inline-flex"
    >
      {#if mode.current === "light"}
        <Sun size={16} />
      {:else}
        <Moon size={16} />
      {/if}
    </Button>
  </Sidebar.Header>

  <Sidebar.Content class="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
    <div
      class="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50"
    >
      Explore
    </div>

    <nav class="grid gap-1">
      {#each categories as item}
        <a
          href={`/explore?category=${item.id}`}
          class={cn(
            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
            isActive(`/explore?category=${item.id}`)
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          )}
        >
          {#if item.icon}
            {@const Icon = item.icon}
            <Icon size={16} />
          {/if}
          {item.name}
        </a>
      {/each}
    </nav>
    <div
      class="my-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50"
    >
      Workspace
    </div>

    <nav class="grid gap-1 mb-8">
      {#each tools as tool}
        <a
          href={`/tools/${tool.id}`}
          class={cn(
            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 border border-transparent",
            isActive(`/tools/${tool.id}`)
              ? "bg-background shadow-sm text-foreground border-border/50 ring-1 ring-black/5"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          )}
        >
          {#if tool.icon}
            {@const Icon = tool.icon}
            <Icon
              size={16}
              class={cn(
                "transition-colors",
                isActive(`/tools/${tool.id}`)
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />
          {/if}
          {tool.title}
          {#if isActive(`/tools/${tool.id}`)}
            <div
              class="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
            ></div>
          {/if}
        </a>
      {/each}
    </nav>
  </Sidebar.Content>

  <Sidebar.Footer class="border-t border-border/40 p-4">
    <div
      class="relative overflow-hidden rounded-xl border border-border/50 bg-linear-to-br from-background to-muted/50 p-4 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500"
        >
          <Sparkles size={14} />
        </div>
        <div>
          <p class="text-xs font-semibold text-foreground">Free Plan</p>
          <p class="text-[10px] text-muted-foreground">Unlimited local use</p>
        </div>
      </div>
      <div
        class="pointer-events-none absolute -right-4 -top-4 h-16 w-16 bg-primary/10 blur-2xl"
      ></div>
    </div>
  </Sidebar.Footer>
</Sidebar.Root>

<style>
  /* Hide scrollbar for cleaner look */
  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
