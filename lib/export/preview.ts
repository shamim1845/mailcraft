export function openPreview(html: string) {
    const w = window.open("about:blank", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
}


