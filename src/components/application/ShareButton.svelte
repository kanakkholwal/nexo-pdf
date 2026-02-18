<script lang="ts">
	import { page } from '$app/state';
	import { Button, type ButtonProps } from '$components/ui/button';
	import ResponsiveDialog from '$components/ui/ResponsiveDialog.svelte';
	import { useShare } from '$lib/hooks/use-share.svelte';
	import {
	  Copy,
	  CopyCheck,
	  Share2,
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		data: {
			title?: string;
			text?: string;
			url?: string;
			image?: string;
		};
		shareCurrentUrl?: boolean;
		// Allow passing generic button props
		class?: string;
		variant?: ButtonProps['variant'];
		size?: ButtonProps["size"];
		children?: import('svelte').Snippet;
	} & HTMLButtonAttributes;

	let {
		data,
		shareCurrentUrl = false,
		class: className,
		variant = 'outline',
		size = 'default',
		children,
		onclick,
		disabled,
		...restProps
	}: Props = $props();

	// Calculate share URL
	let shareUrl = $derived.by(() => {
		if (shareCurrentUrl && typeof window !== 'undefined') {
			return window.location.href;
		}
		// Fallback for SSR or if data.url is explicit
		return data.url || page.url.href; 
	});

	// Use the hook
	const { share, isNativeShareSupported, socials } = useShare(() => ({
		title: data.title,
		text: data.text,
		url: shareUrl, // Accessing derived value inside closure is safe
		image: data.image
	}));

	let copied = $state(false);

	function handleCopy() {
		if (!shareUrl) {
			toast.error('No URL provided to copy');
			return;
		}
		
		navigator.clipboard.writeText(shareUrl)
			.then(() => {
				copied = true;
				toast.success('Link copied to clipboard');
				setTimeout(() => (copied = false), 2000);
			})
			.catch(() => {
				toast.error('Failed to copy link');
			});
	}


</script>

{#if shareUrl}
	<ResponsiveDialog
		title={data.title || 'Share'}
		btnProps={{
			variant,
			size,
			class: className,
			children: children || defaultTriggerLabel,
			disabled
		}}
        class="grid w-full grid-cols-1 gap-4"
	>
		<div class="flex flex-wrap items-center gap-2">
			{#each socials as social}
				<Button
					variant="outline"
					size="icon"
					href={social.url}
					target="_blank"
					rel="noopener noreferrer"
                    title={`Share on ${social.name}`}
				>
					<social.icon class="size-4" />
                    <span class="sr-only">Share on {social.name}</span>
				</Button>
			{/each}

			{#if isNativeShareSupported}
				<Button
					variant="ghost"
					size="icon"
					onclick={() => share()}
                    title="Share via..."
				>
					<Share2 class="h-4 w-4" />
                    <span class="sr-only">Native Share</span>
				</Button>
			{/if}
		</div>

		<p class="text-sm text-muted-foreground">Or copy the link to share manually</p>

		<div class="flex w-full items-center rounded-lg border bg-muted p-3 hover:border-primary transition-colors">
			<p class="flex-1 truncate text-sm text-muted-foreground">
				{shareUrl || 'No URL provided'}
			</p>
			<Button
				variant="ghost"
				size="sm"
				class="ml-auto h-6 px-2"
				onclick={handleCopy}
			>
				{#if copied}
					<CopyCheck class="mr-1 h-3 w-3" />
					Copied!
				{:else}
					<Copy class="mr-1 h-3 w-3" />
					Copy Link
				{/if}
			</Button>
		</div>
	</ResponsiveDialog>
{/if}

{#snippet defaultTriggerLabel()}
	Share
{/snippet}