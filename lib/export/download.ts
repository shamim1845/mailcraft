import { saveAs } from "file-saver";

export function downloadHtmlFile(filename: string, html: string) {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    saveAs(blob, filename.endsWith(".html") ? filename : `${filename}.html`);
}


