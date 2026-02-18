<script>
  import { dev } from "$app/environment";
  import { page } from "$app/state";
  import { config } from "$constants/app";
  
  export let title = config.appName;
  export let description = config.appDescription;
  export let image = "";
  export let isBase = false

  let canonicalUrl = dev
    ? `http://localhost:3000/${page.url.pathname.toString()}`
    : `https://${config.appDomain}${page.url.pathname.toString()}`;
</script>

<svelte:head>
  <title>{isBase ? title : `${title} | ${config.appName}`}</title>
  <meta name="description" content={description} />
  <meta property="og_site_name" content={config.appDomain} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={config.appDomain} />
  <meta property="twitter:url" content={canonicalUrl} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  {@html `  <script type="application/ld+json">{
   "@context": "https://schema.org",
   "@type": "Website",
   "name": "${title} | ${config.appName}",
   "url": "${canonicalUrl}"",
   "logo": ${image}  }</script>`}
</svelte:head>
