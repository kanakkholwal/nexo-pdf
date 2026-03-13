<script lang="ts">
  import { Button } from "$components/ui/button";
  import UploadArea from "$components/ui/UploadArea.svelte";
  import { formatBytes } from "$utils/helper";
  import {
    BadgeCheck,
    Building2,
    Calendar,
    FileSignature,
    Hash,
    Loader2,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
    ShieldX,
    Trash2,
    XCircle
  } from "@lucide/svelte";
  import { ValidateSignatureState } from "./helper.svelte";

  const store = new ValidateSignatureState();

  function formatDate(d: Date | undefined) {
      if (!d || isNaN(d.getTime())) return 'Unknown';
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  }
</script>

{#if !store.file}
  <UploadArea
    accept=".pdf"
    multiple={false}
    onFilesSelected={(files) => store.loadFile(files)}
  />
{:else}
  <div class="sticky top-0 z-20 border-b border-border bg-accent/50 p-4 rounded-lg">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h2 class="text-sm font-semibold flex items-center gap-2">
        <FileSignature size={18} class="text-primary" />
        {store.file.file.name}
        <span class="text-xs font-normal text-muted-foreground ml-2">
          {formatBytes(store.file.originalSize)}
        </span>
      </h2>
      <div class="flex items-center gap-2">
        <Button variant="ghost" onclick={() => store.reset()} disabled={store.isProcessing}>
          <Trash2 size={16} /> Clear
        </Button>
      </div>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto bg-muted/10 p-4 sm:p-6 space-y-6">
    <div class="max-w-4xl mx-auto space-y-6">

        {#if store.results.length === 0}
            <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-semibold flex items-center gap-2 text-foreground">
                        Custom Trust Certificate <span class="text-muted-foreground font-normal text-xs">(Optional)</span>
                    </h3>
                </div>
                <p class="text-xs text-muted-foreground mb-4">
                    If this document was signed using an internal company certificate, you can upload the public key (.pem, .crt) here to verify the trust chain.
                </p>
                
                {#if !store.certFile}
                    <UploadArea 
                        accept=".pem,.crt,.cer" 
                        multiple={false} 
                        onFilesSelected={(files) => store.loadCertFile(files)} 
                    />
                {:else}
                    <div class="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded-lg">
                        <div class="flex items-center gap-2">
                            <BadgeCheck size={16} class="text-primary" />
                            <span class="text-sm font-medium text-primary">{store.certFile.name} loaded</span>
                        </div>
                        <Button variant="ghost" size="icon-sm" class="text-primary hover:text-primary hover:bg-primary/20" onclick={() => store.removeCert()}>
                            <XCircle size={16} />
                        </Button>
                    </div>
                {/if}
            </div>
        {:else}
            <h2 class="text-xl font-bold text-foreground">Signature Validation Results</h2>
            
            <div class="space-y-4">
                {#each store.results as result, idx}
                    <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                        <div class="p-4 border-b border-border flex items-center gap-3 
                            {result.isValid && !result.isExpired && !result.isSelfSigned ? 'bg-emerald-500/10' : 
                             result.isValid && (result.isExpired || result.isSelfSigned) ? 'bg-amber-500/10' : 'bg-destructive/10'}">
                            
                            {#if !result.isValid}
                                <ShieldX class="text-destructive" size={24} />
                                <div>
                                    <h3 class="font-bold text-destructive">Invalid Signature</h3>
                                    <p class="text-xs text-destructive/80">{result.errorMessage || 'Cryptographic check failed.'}</p>
                                </div>
                            {:else if result.isExpired}
                                <ShieldAlert class="text-amber-500" size={24} />
                                <div>
                                    <h3 class="font-bold text-amber-600 dark:text-amber-500">Certificate Expired</h3>
                                    <p class="text-xs text-amber-600/80 dark:text-amber-500/80">The certificate used for this signature has expired.</p>
                                </div>
                            {:else if result.isSelfSigned && !result.isTrusted}
                                <ShieldQuestion class="text-amber-500" size={24} />
                                <div>
                                    <h3 class="font-bold text-amber-600 dark:text-amber-500">Unknown Issuer (Self-Signed)</h3>
                                    <p class="text-xs text-amber-600/80 dark:text-amber-500/80">The signature is mathematically valid, but the identity cannot be verified against a trusted authority.</p>
                                </div>
                            {:else}
                                <ShieldCheck class="text-emerald-500" size={24} />
                                <div>
                                    <h3 class="font-bold text-emerald-600 dark:text-emerald-500">Valid Signature</h3>
                                    <p class="text-xs text-emerald-600/80 dark:text-emerald-500/80">Document integrity and signer identity verified.</p>
                                </div>
                            {/if}
                        </div>

                        <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <div>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Signer</span>
                                    <p class="font-medium text-foreground">{result.signerName}</p>
                                    {#if result.signerOrg} <p class="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><Building2 size={12}/> {result.signerOrg}</p> {/if}
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Issuer Authority</span>
                                    <p class="text-sm text-foreground">{result.issuer}</p>
                                    {#if result.issuerOrg} <p class="text-sm text-muted-foreground">{result.issuerOrg}</p> {/if}
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Reason & Location</span>
                                    <p class="text-sm text-foreground">{result.reason || 'Not specified'}</p>
                                    {#if result.location} <p class="text-sm text-muted-foreground">{result.location}</p> {/if}
                                </div>
                            </div>

                            <div class="space-y-3 bg-muted/30 p-4 rounded-lg border border-border">
                                <div>
                                    <span class="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12}/> Valid From</span>
                                    <p class="text-sm font-mono">{formatDate(result.validFrom)}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12}/> Valid To</span>
                                    <p class="text-sm font-mono {result.isExpired ? 'text-destructive font-bold' : ''}">{formatDate(result.validTo)}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground flex items-center gap-1"><Hash size={12}/> Algorithms</span>
                                    <p class="text-sm font-mono">{result.algorithms.signature} / {result.algorithms.digest}</p>
                                </div>
                                <div>
                                    <span class="text-xs text-muted-foreground flex items-center gap-1"><FileSignature size={12}/> Document Coverage</span>
                                    <p class="text-sm font-mono">
                                        {#if result.coverageStatus === 'full'} Entire Document (Untampered)
                                        {:else if result.coverageStatus === 'partial'} Partial (Modifications made after signing)
                                        {:else} Unknown {/if}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

    </div>
  </div>

  {#if store.results.length === 0}
      <div class="border-t border-border p-4 text-center">
        <Button
          size="lg"
          variant="dark"
          class="px-8 h-11 min-w-50"
          onclick={() => store.process()}
          disabled={store.isProcessing}
        >
          {#if store.isProcessing}
            <Loader2 class="animate-spin mr-2" size={18} /> Analyzing...
          {:else}
            Validate Signatures <ShieldCheck size={18} class="ml-2" />
          {/if}
        </Button>
      </div>
  {/if}
{/if}