<script lang="ts">
 import {
   ArrowRight,
   CheckCircle2,
   Cpu,
   Globe2,
   Image,
   LayoutGrid,
   Lock,
   Merge,
   Shield,
   Split,
   Unlock,
   Zap
 } from '@lucide/svelte';

  // Tool definition for the Bento Grid
  const tools = [
    {
      title: "Merge PDF",
      desc: "Combine multiple PDF files into one document.",
      icon: Merge,
      href: "/merge",
      color: "text-blue-500",
    },
    {
      title: "Split PDF",
      desc: "Extract pages or split your document into sections.",
      icon: Split,
      href: "/split",
      color: "text-orange-500",
    },
    {
      title: "Compress PDF",
      desc: "Reduce file size while maintaining quality.",
      icon: Zap,
      href: "/compress",
      color: "text-yellow-500",
    },
    {
      title: "PDF to Image",
      desc: "Convert PDF pages into high-quality JPG or PNG.",
      icon: Image,
      href: "/pdf-to-image",
      color: "text-purple-500",
    },
    {
      title: "Protect PDF",
      desc: "Encrypt your PDF with a secure password.",
      icon: Lock,
      href: "/protect",
      color: "text-green-500",
    },
    {
      title: "Unlock PDF",
      desc: "Remove passwords from protected documents.",
      icon: Unlock,
      href: "/unlock",
      color: "text-red-500",
    },
  ];

  const features = [
    {
      title: "100% Client-Side",
      desc: "Files never leave your device. Processing happens locally in your browser.",
      icon: Shield,
    },
    {
      title: "No Limits",
      desc: "Process as many files as you want. No file size limits or daily caps.",
      icon: Zap,
    },
    {
      title: "Works Offline",
      desc: "No internet? No problem. The PWA works completely offline.",
      icon: Globe2,
    },
  ];
</script>



  <main class="flex flex-col items-center">
    <section class="w-full py-24 md:py-32 lg:py-40 px-4 text-center">
      <div class="container mx-auto max-w-5xl space-y-8">
        <div
          class="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
        >
          <span
            class="mr-2 flex h-2 w-2 rounded-full bg-green-500 animate-pulse"
          ></span>
		  New: Now open source on GitHub!
        </div>

        <h1
          class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Master your PDFs with <br class="hidden sm:block" />
          <span
            class="text-transparent bg-clip-text bg-linear-to-r from-foreground to-foreground/70"
          >
            absolute privacy.
          </span>
        </h1>

        <p
          class="mx-auto max-w-175 text-lg text-muted-foreground md:text-xl leading-relaxed"
        >
         Our PDF tools work entirely in your browser, so you only have to load them once, 
      and get secure, beautiful results forever.
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <a
            href="/explore"
            class="inline-flex h-12 items-center justify-center rounded-lg bg-foreground text-background px-8 text-sm font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/10"
          >
            Explore Tools
            <ArrowRight class="ml-2 size-4" />
          </a>
          <a
            href="https://github.com/kanakkholwa/nexopdf"
            target="_blank"
            class="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View on GitHub
          </a>
        </div>

        <div
          class="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-border/40 mt-16 max-w-4xl mx-auto"
        >
          <div class="space-y-1">
            <h3 class="text-2xl font-bold">1M+</h3>
            <p class="text-xs text-muted-foreground uppercase tracking-wider">
              Files Processed
            </p>
          </div>
          <div class="space-y-1">
            <h3 class="text-2xl font-bold">0</h3>
            <p class="text-xs text-muted-foreground uppercase tracking-wider">
              Server Uploads
            </p>
          </div>
          <div class="space-y-1">
            <h3 class="text-2xl font-bold">100%</h3>
            <p class="text-xs text-muted-foreground uppercase tracking-wider">
              Open Source
            </p>
          </div>
          <div class="space-y-1">
            <h3 class="text-2xl font-bold">4.9/5</h3>
            <p class="text-xs text-muted-foreground uppercase tracking-wider">
              User Rating
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      id="tools"
      class="w-full py-20 px-4 bg-muted/30 border-y border-border/40"
    >
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col items-center mb-12 space-y-2 text-center">
          <h2 class="text-3xl font-bold tracking-tight">Powerful Tools</h2>
          <p class="text-muted-foreground max-w-150">
            Everything you need to manage your documents without compromising
            security.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each tools as tool}
            <a
              href={tool.href}
              class="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
            >
              <div
                class="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              >
			  </div>

              <div class="relative z-10 flex flex-col gap-4">
                <div
                  class={`h-12 w-12 rounded-lg bg-background border border-border flex items-center justify-center shadow-sm ${tool.color}`}
                >
                  <svelte:component this={tool.icon} size={24} />
                </div>
                <div>
                  <h3
                    class="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors"
                  >
                    {tool.title}
                  </h3>
                  <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </section>

    <section class="w-full py-24 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
              Privacy isn't an option. <br />
              <span class="text-muted-foreground">It's the default.</span>
            </h2>
            <p class="text-lg text-muted-foreground">
              Most PDF tools upload your sensitive data to their servers to
              process it. We built a WebAssembly engine that runs complex PDF
              operations directly inside your browser.
            </p>

            <div class="space-y-4">
              {#each features as feature}
                <div class="flex gap-4">
                  <div
                    class="mt-1 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                  >
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">{feature.title}</h4>
                    <p class="text-sm text-muted-foreground mt-1">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <div
            class="relative rounded-2xl border border-border bg-muted/20 p-8 md:p-12"
          >
            <div
              class="absolute inset-0 bg-linear-to-tr from-blue-500/5 via-purple-500/5 to-transparent rounded-2xl"
            >
			</div>
            <div class="relative grid gap-6">
              <div
                class="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center gap-4"
              >
                <div
                  class="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"
                >
                  <Lock size={20} />
                </div>
                <div>
                  <div class="font-medium">End-to-End Local</div>
                  <div class="text-xs text-muted-foreground">
                    Your device is the server
                  </div>
                </div>
              </div>
              <div
                class="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center gap-4 opacity-80"
              >
                <div
                  class="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"
                >
                  <Cpu size={20} />
                </div>
                <div>
                  <div class="font-medium">WASM Powered</div>
                  <div class="text-xs text-muted-foreground">
                    Native performance
                  </div>
                </div>
              </div>
              <div
                class="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center gap-4 opacity-60"
              >
                <div
                  class="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500"
                >
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <div class="font-medium">Modular Architecture</div>
                  <div class="text-xs text-muted-foreground">
                    Load only what you need
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
