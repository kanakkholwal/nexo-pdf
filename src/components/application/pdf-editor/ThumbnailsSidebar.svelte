<script lang="ts">
    import { useScroll } from "@embedpdf/plugin-scroll/svelte";
    import type { ThumbMeta } from "@embedpdf/plugin-thumbnail";
    import {
        ThumbImg,
        ThumbnailsPane,
    } from "@embedpdf/plugin-thumbnail/svelte";

    interface ThumbnailsSidebarProps {
        documentId: string;
    }

    let { documentId }: ThumbnailsSidebarProps = $props();

    const scroll = useScroll(() => documentId);

    const handleClick = (pageIndex: number) => {
        scroll.provides?.scrollToPage?.({
            pageNumber: pageIndex + 1,
            behavior: "smooth",
        });
    };
</script>

<div class="flex h-full w-56 flex-col border-r border-gray-300 bg-gray-50">
    <!-- Thumbnails -->
    <div class="flex-1 overflow-hidden">
        <ThumbnailsPane {documentId} style="width: 100%; height: 100%;">
            {#snippet children(meta: ThumbMeta)}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                    role="button"
                    tabindex={0}
                    style:position="absolute"
                    style:width="100%"
                    style:height="{meta.wrapperHeight}px"
                    style:top="{meta.top}px"
                    style:display="flex"
                    style:flex-direction="column"
                    style:align-items="center"
                    style:cursor="pointer"
                    style:padding="8px"
                    onclick={() => handleClick(meta.pageIndex)}
                >
                    <div
                        style:width="{meta.width}px"
                        style:height="{meta.height}px"
                        style:border="2px solid {scroll.state.currentPage ===
                        meta.pageIndex + 1
                            ? '#3b82f6'
                            : '#d1d5db'}"
                        style:border-radius="4px"
                        style:overflow="hidden"
                        style:box-shadow={scroll.state.currentPage ===
                        meta.pageIndex + 1
                            ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
                            : "none"}
                        style:transition="all 0.2s"
                    >
                        <ThumbImg
                            {meta}
                            {documentId}
                            style="width: 100%; height: 100%; display: block;"
                        />
                    </div>
                    <div
                        style:height="{meta.labelHeight}px"
                        style:margin-top="4px"
                        class="text-xs text-gray-600"
                    >
                        Page {meta.pageIndex + 1}
                    </div>
                </div>
            {/snippet}
        </ThumbnailsPane>
    </div>
</div>
