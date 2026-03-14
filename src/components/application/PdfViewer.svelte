<script lang="ts">
  import { createPluginRegistration } from "@embedpdf/core";
  import { EmbedPDF } from "@embedpdf/core/svelte";
  import { usePdfiumEngine } from "@embedpdf/engines/svelte";
// Import the essential plugins and their components
  import {
    DocumentContent,
    DocumentManagerPluginPackage,
  } from "@embedpdf/plugin-document-manager/svelte";
  import {
    RenderLayer,
    RenderPluginPackage,
  } from "@embedpdf/plugin-render/svelte";
  import {
    Scroller,
    ScrollPluginPackage,
    type RenderPageProps,
  } from "@embedpdf/plugin-scroll/svelte";
  import {
    Viewport,
    ViewportPluginPackage,
  } from "@embedpdf/plugin-viewport/svelte";

  // 1. Initialize the engine with the Svelte store
  const pdfEngine = usePdfiumEngine();

  // 2. Register the plugins you need
  const plugins = [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url: "https://snippet.embedpdf.com/ebook.pdf" }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
  ];
</script>

{#if pdfEngine.isLoading || !pdfEngine.engine}
  <div class="loading-pane">Loading PDF Engine...</div>
{:else}
  <!-- 3. Wrap your UI with the <EmbedPDF> provider -->
  <div style="height: 500px;">
    <EmbedPDF engine={pdfEngine.engine} {plugins}>
      {#snippet children({ activeDocumentId })}
        {#if activeDocumentId}
          {@const documentId = activeDocumentId}
          <DocumentContent {documentId}>
            {#snippet children(documentContent)}
              {#if documentContent.isLoaded}
                {#snippet renderPage(page: RenderPageProps)}
                  <div
                    style:width="{page.width}px"
                    style:height="{page.height}px"
                    style:position="relative"
                  >
                    <!-- The RenderLayer is responsible for drawing the page -->
                    <RenderLayer {documentId} pageIndex={page.pageIndex} />
                  </div>
                {/snippet}
                <Viewport {documentId} class="bg-card">
                  <Scroller {documentId} {renderPage} />
                </Viewport>
              {/if}
            {/snippet}
          </DocumentContent>
        {/if}
      {/snippet}
    </EmbedPDF>
  </div>
{/if}

<style>
  .loading-pane {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
