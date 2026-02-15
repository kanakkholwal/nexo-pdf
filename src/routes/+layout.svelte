<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "@fontsource/google-sans/400.css";
  import "@fontsource/google-sans/500.css";
  import "@fontsource/google-sans/600.css";
  import "@fontsource/google-sans/700.css";
  import "../app.css";
  let { children } = $props();

  import Footer from "$components/common/footer.svelte";
  import Navbar from "$components/common/navbar.svelte";
  import { ModeWatcher } from "mode-watcher";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Nexo PDF</title>
</svelte:head>

<ModeWatcher />

<div
  class="relative min-h-screen w-full flex flex-col antialiased bg-background text-foreground transition-colors duration-300"
>
  <Navbar />

  <div
    aria-hidden="true"
    class="fixed inset-0 z-0 overflow-hidden pointer-events-none"
  >
    <div
      class="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"
    ></div>

    <div
      class="absolute top-[-10%] left-[-10%] size-125 rounded-full
             bg-purple-300/30 blur-[120px]
             dark:bg-purple-900/20"
    ></div>

    <div
      class="absolute top-[20%] right-[-5%] size-150 rounded-full
             bg-blue-300/30 blur-[120px]
             dark:bg-blue-900/20"
    ></div>

    <div
      class="absolute bottom-[-10%] left-[20%] size-150 rounded-full
             bg-indigo-200/40 blur-[120px]
             dark:bg-indigo-900/20"
    ></div>
  </div>

  <main class="relative z-10 flex-1">
    {@render children()}
  </main>

  <Footer />
</div>
