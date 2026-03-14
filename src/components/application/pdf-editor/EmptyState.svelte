<script lang="ts">
    import { Button } from "$components/ui/button";
    import { useDocumentManagerCapability } from "@embedpdf/plugin-document-manager/svelte";
    import { FileTextIcon, Plus } from "@lucide/svelte";

    interface EmptyStateProps {
        onDocumentOpened?: (documentId: string) => void;
    }

    let { onDocumentOpened }: EmptyStateProps = $props();

    const documentManagerCapability = useDocumentManagerCapability();

    const handleOpenFile = () => {
        const provides = documentManagerCapability.provides;
        const openTask = provides?.openFileDialog();
        openTask?.wait(
            (result) => {
                onDocumentOpened?.(result.documentId);
            },
            (error) => {
                console.error("Open file failed:", error);
            },
        );
    };
</script>

<div class="flex flex-1 items-center justify-center bg-card">
    <div class="max-w-md text-center">
        <div class="mb-6 flex justify-center">
            <div class="rounded-full bg-primary/10 p-6">
                <FileTextIcon class="h-16 w-16 text-primary" />
            </div>
        </div>
        <h2 class="mb-3 text-2xl font-bold text-foreground">
            No Documents Open
        </h2>
        <p class="mb-8 text-muted-foreground">
            Get started by opening a PDF document. You can view multiple
            documents at once using tabs and split views.
        </p>
        <Button onclick={handleOpenFile}>
            <Plus />
            Open PDF Document
        </Button>
        <div class="mt-6 text-sm text-muted-foreground">
            Supported format: PDF
        </div>
    </div>
</div>
