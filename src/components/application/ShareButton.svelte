<script lang="ts">
  import { page } from "$app/state";
  import { Button, type ButtonProps } from "$components/ui/button";
  import ResponsiveDialog from "$components/ui/ResponsiveDialog.svelte";
  import { useShare } from "$lib/hooks/use-share.svelte";
  import { cn } from "$lib/utils";
  import { Check, Copy, Share2 } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { toast } from "svelte-sonner";

  type Props = {
    data: {
      title?: string;
      text?: string;
      url?: string;
      image?: string;
    };
    shareCurrentUrl?: boolean;
    class?: string;
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    children?: Snippet;
  } & HTMLButtonAttributes;

  let {
    data,
    shareCurrentUrl = false,
    class: className,
    variant = "outline",
    size = "default",
    children,
    disabled,
  }: Props = $props();

  let shareUrl = $derived.by(() => {
    if (shareCurrentUrl && typeof window !== "undefined") {
      return window.location.href;
    }
    return data.url || page.url.href;
  });

  const { share, isNativeShareSupported, socials } = useShare(() => ({
    title: data.title,
    text: data.text,
    url: shareUrl,
    image: data.image,
  }));

  let copied = $state(false);

  function handleCopy() {
    if (!shareUrl) {
      toast.error("No URL provided to copy");
      return;
    }
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        copied = true;
        toast.success("Link copied");
        setTimeout(() => (copied = false), 2000);
      })
      .catch(() => toast.error("Failed to copy link"));
  }
</script>

{#if shareUrl}
  <ResponsiveDialog
    title={shareTitle}
    btnProps={{
      variant,
      size,
      class: className,
      children: children || defaultTriggerLabel,
      disabled,
    }}
    class="flex flex-col gap-6"
  >
    <section class="flex flex-col gap-3">
      <div class="flex items-baseline justify-between border-b border-border/60 pb-2">
        <span
          class="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
        >
          Networks
        </span>
        <span class="font-mono text-[10px] tabular-nums text-muted-foreground/50">
          {String(socials.length + (isNativeShareSupported ? 1 : 0)).padStart(
            2,
            "0"
          )}
        </span>
      </div>

      <div class="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {#each socials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${social.name}`}
            class={cn(
              "group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-sm border border-border/60 bg-card transition-colors",
              "hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            <span
              class="inline-flex size-7 items-center justify-center rounded-sm bg-muted/60 text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
            >
              <social.icon class="size-3.5" />
            </span>
            <span
              class="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-primary"
            >
              {social.name}
            </span>
            <span class="sr-only">Share on {social.name}</span>
          </a>
        {/each}

        {#if isNativeShareSupported}
          <button
            type="button"
            onclick={() => share()}
            title="Share via system"
            class="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-sm border border-primary/30 bg-primary/5 transition-colors hover:bg-primary/10"
          >
            <span
              class="inline-flex size-7 items-center justify-center rounded-sm bg-primary/15 text-primary"
            >
              <Share2 class="size-3.5" />
            </span>
            <span
              class="font-mono text-[9px] uppercase tracking-[0.14em] text-primary"
            >
              System
            </span>
            <span class="sr-only">Native share</span>
          </button>
        {/if}
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <div class="flex items-baseline justify-between border-b border-border/60 pb-2">
        <span
          class="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
        >
          Direct link
        </span>
        <span class="font-mono text-[10px] tabular-nums text-muted-foreground/50">
          {copied ? "Copied" : "Copy"}
        </span>
      </div>

      <div
        class={cn(
          "flex w-full items-center gap-2 rounded-sm border border-border/60 bg-muted/30 px-3 py-2 transition-colors",
          copied ? "border-success/40 bg-success/5" : "hover:border-primary/40"
        )}
      >
        <p
          class="flex-1 truncate font-mono text-xs tabular-nums text-foreground"
          title={shareUrl}
        >
          {shareUrl}
        </p>
        <Button
          variant="ghost"
          size="sm"
          class={cn(
            "h-7 shrink-0 rounded-sm font-mono text-[10px] uppercase tracking-[0.14em]",
            copied
              ? "text-success hover:text-success"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
          )}
          onclick={handleCopy}
        >
          {#if copied}
            <Check class="size-3" />
            Copied
          {:else}
            <Copy class="size-3" />
            Copy
          {/if}
        </Button>
      </div>
    </section>
  </ResponsiveDialog>
{/if}

{#snippet shareTitle()}
  <div class="flex flex-col gap-1">
    <span
      class="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary"
    >
      Share
    </span>
    <span class="text-base font-semibold tracking-tight text-foreground">
      {data.title || "Share this page"}
    </span>
  </div>
{/snippet}

{#snippet defaultTriggerLabel()}
  Share
{/snippet}
