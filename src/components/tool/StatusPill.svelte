<script lang="ts">
  import { cn } from "$lib/utils";
  import {
    CircleAlert,
    CircleCheck,
    LoaderCircle,
  } from "@lucide/svelte";

  type Status = "idle" | "processing" | "done" | "error";

  interface Props {
    status: Status;
    label?: string;
    class?: string;
  }

  let { status, label, class: className = "" }: Props = $props();

  const tone: Record<Status, string> = {
    idle: "bg-muted/60 text-muted-foreground",
    processing: "bg-primary/10 text-primary",
    done: "bg-success/10 text-success",
    error: "bg-destructive/10 text-destructive",
  };

  const fallback: Record<Status, string> = {
    idle: "Ready",
    processing: "Working",
    done: "Done",
    error: "Error",
  };
</script>

<span
  class={cn(
    "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em]",
    tone[status],
    className
  )}
>
  {#if status === "processing"}
    <LoaderCircle class="size-3 animate-spin" />
  {:else if status === "done"}
    <CircleCheck class="size-3" />
  {:else if status === "error"}
    <CircleAlert class="size-3" />
  {/if}
  <span>{label ?? fallback[status]}</span>
</span>
