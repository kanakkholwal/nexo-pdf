<script lang="ts">
    import CloseIcon from "$components/icons/registry/CloseIcon.svelte";
    import DocumentIcon from "$components/icons/registry/DocumentIcon.svelte";
    import PlusIcon from "$components/icons/registry/PlusIcon.svelte";
    import { Button, buttonVariants } from "$components/ui/button";
    import { cn } from "$lib/utils";
    import type { DocumentState } from "@embedpdf/core";
    import { useDocumentManagerCapability } from "@embedpdf/plugin-document-manager/svelte";

    interface TabBarProps {
        documentStates: DocumentState[];
        activeDocumentId: string | null;
    }
    let { documentStates, activeDocumentId }: TabBarProps = $props();

    const documentManagerCapability = useDocumentManagerCapability();

    const onSelect = (id: string) => {
        documentManagerCapability.provides?.setActiveDocument(id);
    };

    const onClose = (id: string) => {
        documentManagerCapability.provides?.closeDocument(id);
    };

    const onOpenFile = () => {
        documentManagerCapability.provides?.openFileDialog();
    };

    const handleKeyDown = (e: KeyboardEvent, documentId: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(documentId);
        }
    };
</script>

<div class="flex items-end gap-0.5 bg-accent p-2">
    <!-- Document Tabs -->
    <div class="flex flex-1 items-end gap-0.5 overflow-x-auto -mb-2">
        {#each documentStates as document (document.id)}
            <div
                onclick={() => onSelect(document.id)}
                onkeydown={(e) => handleKeyDown(e, document.id)}
                role="tab"
                tabindex={0}
                aria-selected={activeDocumentId === document.id}
                class={cn(
                    "group relative flex min-w-[120px] max-w-[240px] cursor-pointer",
                    buttonVariants({
                        size: "icon-sm",
                        variant:
                            activeDocumentId === document.id
                                ? "default_soft"
                                : "ghost",
                    }),
                )}
            >
                <!-- Document Icon -->
                <DocumentIcon class="h-4 w-4 shrink-0" title="Document" />

                <!-- Document Name -->
                <span class="min-w-0 flex-1 truncate">
                    {document.name ?? `Document ${document.id.slice(0, 8)}`}
                </span>

                <!-- Close Button -->
                <Button
                    onclick={(e) => {
                        e.stopPropagation();
                        onClose(document.id);
                    }}
                    variant={activeDocumentId === document.id
                        ? "secondary"
                        : "ghost"}
                    size="icon"
                    aria-label="Close {document.name ?? 'document'}"
                    disabled={documentStates.length === 1}
                >
                    <CloseIcon class="h-3.5 w-3.5" title="Close" />
                </Button>
            </div>
        {/each}

        <!-- Add Tab (Open File) - placed directly after tabs like Chrome -->
    </div>
    <Button
        onclick={onOpenFile}
        variant="outline"
        size="icon-xs"
        aria-label="Open File"
        title="Open File"
    >
        <PlusIcon class="h-4 w-4" title="Open File" />
    </Button>
</div>
