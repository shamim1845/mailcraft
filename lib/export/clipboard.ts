export async function copyHtmlToClipboard(html: string) {
    try {
        await navigator.clipboard.writeText(html);
        return true;
    } catch {
        return false;
    }
}


