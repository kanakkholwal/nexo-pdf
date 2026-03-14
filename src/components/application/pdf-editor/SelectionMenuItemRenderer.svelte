<script lang="ts">
    import { Separator } from "$components/ui/separator";
    import {
        type SelectionMenuItem,
        type SelectionMenuPropsBase,
        getUIItemProps,
    } from "@embedpdf/plugin-ui/svelte";
    import CommandButtonItem from "./CommandButtonItem.svelte";
    import Self from "./SelectionMenuItemRenderer.svelte";

    interface Props {
        item: SelectionMenuItem;
        documentId: string;
        props: SelectionMenuPropsBase;
    }

    let { item, documentId, props }: Props = $props();
</script>

{#if item.type === "command-button"}
    <CommandButtonItem {item} {documentId} />
{:else if item.type === "divider"}
    <div {...getUIItemProps(item)}>
        <Separator orientation="vertical" />
    </div>
{:else if item.type === "group"}
    <div
        {...getUIItemProps(item)}
        class="flex items-center gap-{item.gap ?? 1}"
    >
        {#each item.items as child (child.id)}
            <Self item={child} {documentId} {props} />
        {/each}
    </div>
{/if}
