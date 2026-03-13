import { dev } from '$app/environment';
import {
    PUBLIC_ADSENSE_PUBLISHER_ID,
    PUBLIC_GOOGLE_ANALYTICS_ID
} from '$env/static/public';

const config = {
    appName: 'Orbit PDF',
    appVersion: '0.1.0',
    appDescription: `Free, fast, and offline PDF toolkit for professionals. Edit, convert, and process PDFs entirely in your browser with no data uploads. 100% client-side processing.`,
    appKeywords: ['free pdf tools', 'offline pdf editor', 'client-side pdf processing', 'fast pdf converter', 'privacy-focused pdf toolkit', 'web-based pdf tool', 'no upload pdf processing', 'open source pdf'],
    supportEmail: "support@nexonauts.com",
    appDomain: "orbit.nexonauts.com",
    github: "https://github.com/kanakkholwal/orbit",
    adsensePublisherId: dev ? "" : (PUBLIC_ADSENSE_PUBLISHER_ID?.trim() || ""),
    googleAnalyticsId: dev ? "" : (PUBLIC_GOOGLE_ANALYTICS_ID?.trim() || ""),
}
Object.freeze(config);

export { config };
