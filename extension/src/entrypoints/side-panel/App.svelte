<script lang="ts">
  import ToolList from './ToolList.svelte';

  const ORBIT_URL = import.meta.env.VITE_ORBIT_WEB_URL ?? 'https://orbitpdf.com';

  let search = $state('');
  let darkMode = $state(false);

  $effect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    darkMode = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      darkMode = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });
</script>

<div
  class:dark={darkMode}
  class="flex h-screen flex-col bg-[var(--background)] text-[var(--foreground)]"
>
  <!-- Header -->
  <header
    class="flex shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[var(--card)] px-3 py-2.5"
  >
    <img src="/icons/icon32.png" alt="Orbit" class="size-5 shrink-0" />
    <span class="text-sm font-semibold tracking-tight">Orbit PDF</span>
    <a
      href={ORBIT_URL}
      target="_blank"
      rel="noopener noreferrer"
      class="ml-auto shrink-0 rounded px-2 py-0.5 text-xs text-[var(--primary)] hover:underline"
    >
      Open app
    </a>
  </header>

  <!-- Search -->
  <div class="shrink-0 border-b border-[var(--border)] px-3 py-2">
    <input
      type="search"
      placeholder="Search tools..."
      bind:value={search}
      class="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm outline-none placeholder:text-[var(--muted-foreground)] focus:ring-1 focus:ring-[var(--primary)]"
    />
  </div>

  <!-- Tool list -->
  <div class="min-h-0 flex-1 overflow-y-auto">
    <ToolList {search} orbitUrl={ORBIT_URL} />
  </div>

  <!-- Footer -->
  <footer
    class="shrink-0 border-t border-[var(--border)] px-3 py-2 text-center text-[10px] text-[var(--muted-foreground)]"
  >
    All processing happens locally — no uploads.
  </footer>
</div>
