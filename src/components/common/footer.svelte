<script lang="ts">
  import { Disc, FileText, Github, Twitter } from "@lucide/svelte";

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Merge PDF", href: "/merge" },
        { label: "Split PDF", href: "/split" },
        { label: "Compress", href: "/compress" },
        { label: "Pricing", href: "/pricing" },
        { label: "Changelog", href: "/updates" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "API Reference", href: "/api" },
        { label: "Blog", href: "/blog" },
        { label: "Community", href: "/community" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
      ],
    },
  ];
</script>

<footer class="w-full text-sm">
  <div class="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
      
      <div class="space-y-6 lg:col-span-1">
        <a href="/" class="flex items-center gap-2.5 group">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"
          >
            <FileText size={20} strokeWidth={2.5} />
          </div>
          <span class="font-bold text-lg tracking-tight text-foreground">Nexo PDF</span>
        </a>
        <p class="text-muted-foreground leading-relaxed max-w-xs">
          The privacy-first PDF toolkit for professionals. Process documents locally without them ever touching a server.
        </p>
        
        <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          All systems operational
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8 md:grid-cols-3 lg:col-span-3">
        {#each footerLinks as section}
          <div>
            <h3 class="font-semibold text-foreground tracking-tight mb-4">{section.title}</h3>
            <ul class="space-y-3">
              {#each section.links as link}
                <li>
                  <a
                    href={link.href}
                    class="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>

    <div class="mt-16 border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-muted-foreground text-xs">
        &copy; {currentYear} Nexo PDF. All rights reserved.
      </p>
      
      <div class="flex items-center gap-4">
        <a href="https://github.com/kanakkholwal/nexo-pdf" target="_blank" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
          <Github size={18} />
        </a>
        <a href="https://twitter.com/nexo_pdf" target="_blank" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
          <Twitter size={18} />
        </a>
        <a href="https://discord.com" target="_blank" class="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord">
          <Disc size={18} />
        </a>
      </div>
    </div>
  </div>
</footer>