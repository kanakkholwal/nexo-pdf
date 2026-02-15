<script lang="ts">
  import { FileText, Github, Menu, Moon, Sun, X } from "@lucide/svelte";
  import { mode, toggleMode } from "mode-watcher";
  import { quartOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  let isMobileOpen = false;
  let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<header
  class="sticky top-0 lg:top-4 z-50 w-full mx-auto max-w-4xl mt-10 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl transition-all duration-300"
  class:shadow-sm={scrollY > 10}
>
  <div
    class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"
  >
    <a href="/" class="flex items-center gap-2.5 group">
      <div
        class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"
      >
        <FileText size={20} strokeWidth={2.5} />
      </div>
      <span class="font-bold text-lg tracking-tight text-foreground"
        >Nexo PDF</span
      >
    </a>

    <nav class="hidden md:flex items-center gap-1">
      {#each ["Tools", "Privacy", "Pricing"] as item}
        <a
          href={`#${item.toLowerCase()}`}
          class="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
        >
          {item}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-3">
      <a
        href="https://github.com/kanakkholwal/nexo-pdf"
        target="_blank"
        class="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Github size={20} />
      </a>
      <button
        on:click={toggleMode}
        class="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
      {#if mode.current === "light"}
        <Sun size={20} />
      {:else}
        <Moon size={20} />
      {/if}
      </button>


      <div class="h-5 w-px bg-border hidden sm:block"></div>

      <a
        href="#tools"
        class="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
      >
        Get Started
      </a>

      <button
        class="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors"
        on:click={() => (isMobileOpen = !isMobileOpen)}
        aria-label="Toggle Menu"
      >
        {#if isMobileOpen}
          <X size={20} />
        {:else}
          <Menu size={20} />
        {/if}
      </button>
    </div>
  </div>

  {#if isMobileOpen}
    <div
      transition:slide={{ duration: 250, easing: quartOut }}
      class="border-t border-border/40 bg-background md:hidden"
    >
      <div class="flex flex-col p-4 space-y-1">
        {#each ["Tools", "Privacy", "Pricing", "GitHub"] as item}
          <a
            href={item === "GitHub"
              ? "https://github.com/kanakkholwal/nexo-pdf"
              : `#${item.toLowerCase()}`}
            class="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            on:click={() => (isMobileOpen = false)}
          >
            {item}
          </a>
        {/each}
        <div class="pt-2 mt-2 border-t border-border/40">
          <a
            href="#tools"
            class="flex w-full items-center justify-center rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background"
            on:click={() => (isMobileOpen = false)}
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  {/if}
</header>
