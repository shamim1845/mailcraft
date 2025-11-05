import juice from "juice";
import { Block, Template } from "../schema/block";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderBlock(b: Block): string {
  switch (b.type) {
    case "text": {
      const style = `font-family:${b.fontFamily}; font-size:${b.fontSize}px; color:${b.color}; text-align:${b.align}; padding:${b.padding.top}px ${b.padding.right}px ${b.padding.bottom}px ${b.padding.left}px;`;
      return `<tr><td style="${style}">${b.html}</td></tr>`;
    }
    case "image": {
      const align = b.align === "center" ? "center" : b.align === "right" ? "right" : "left";
      const img = `<img src="${escapeHtml(b.url)}" alt="${escapeHtml(b.alt)}" width="${b.width === "100%" ? 600 : b.width}" style="display:block; width:${b.width}; height:${b.height}; border:0; outline:none; text-decoration:none;"/>`;
      const linked = b.link ? `<a href="${escapeHtml(b.link)}">${img}</a>` : img;
      const style = `text-align:${align}; padding:${b.padding.top}px ${b.padding.right}px ${b.padding.bottom}px ${b.padding.left}px;`;
      return `<tr><td style="${style}">${linked}</td></tr>`;
    }
    case "button": {
      const full = b.align === "full";
      const content = `<a href="${escapeHtml(b.url)}" style="background:${b.bg}; color:${b.color}; text-decoration:none; border-radius:${b.radius}px; font-size:${b.fontSize}px; display:${full ? "block" : "inline-block"}; ${full ? "width:100%; text-align:center;" : ""} padding:${b.paddingV}px ${b.paddingH}px;">${escapeHtml(b.text)}</a>`;
      const align = full ? "center" : b.align;
      return `<tr><td style="text-align:${align}; padding:0;">${content}</td></tr>`;
    }
    case "divider": {
      const style = `border-top:${b.thickness}px ${b.style} ${b.color}; height:0; margin:0;`;
      return `<tr><td style="padding:${b.padding.top}px 0 ${b.padding.bottom}px 0;"><div style="${style}"></div></td></tr>`;
    }
    case "spacer": {
      return `<tr><td style="line-height:${b.height}px; height:${b.height}px; font-size:0;">&nbsp;</td></tr>`;
    }
    case "social": {
      const icons = b.platforms
        .map((p) => `<a href="${escapeHtml(p.url)}" style="display:inline-block; width:${b.size}px; height:${b.size}px; margin-right:${b.gap}px;"><span style="display:inline-block; width:${b.size}px; height:${b.size}px; background:#e5e7eb; border-radius:9999px;"></span></a>`) // placeholder circles
        .join("");
      return `<tr><td style="text-align:${b.align};">${icons}</td></tr>`;
    }
    case "icon": {
      const box = `<span style="display:inline-block; width:${(b as any).size}px; height:${(b as any).size}px; background:${(b as any).color}; border-radius:4px;"></span>`;
      const linked = (b as any).url ? `<a href="${escapeHtml((b as any).url)}">${box}</a>` : box;
      return `<tr><td style="text-align:center; padding:8px 0;">${linked}</td></tr>`;
    }
    case "header": {
      const hb = b as any;
      const pad = `${hb.padding.top}px ${hb.padding.right}px ${hb.padding.bottom}px ${hb.padding.left}px`;
      const logo = hb.logoUrl ? `<img src="${escapeHtml(hb.logoUrl)}" alt="logo" height="32" style="display:block; height:32px;"/>` : `<span style="font-size:14px;">Logo</span>`;
      const menu = hb.menu
        .map((m: any) => `<a href="${escapeHtml(m.url)}" style="color:${hb.color}; text-decoration:none; margin-left:12px; font-size:14px;">${escapeHtml(m.text)}</a>`)
        .join("");
      return `<tr><td style="background:${hb.bg}; color:${hb.color}; padding:${pad};"><table role=\"presentation\" width=\"100%\"><tr><td align=\"left\">${logo}</td><td align=\"right\">${menu}</td></tr></table></td></tr>`;
    }
    case "footer": {
      const fb = b as any;
      const socials = fb.socials
        .map((s: any) => `<a href="${escapeHtml(s.url)}" style="color:#2563eb; text-decoration:none; margin:0 6px; font-size:12px;">${s.key}</a>`)
        .join("");
      const parts = [
        `<div style=\"font-weight:600;\">${escapeHtml(fb.company)}</div>`,
        fb.address ? `<div style=\"opacity:.7;\">${escapeHtml(fb.address)}</div>` : "",
        `<div style=\"margin-top:8px;\">${socials}</div>`,
        fb.unsubscribeText ? `<div style=\"margin-top:8px; opacity:.7;\">${escapeHtml(fb.unsubscribeText)}</div>` : "",
        fb.copyright ? `<div style=\"margin-top:8px; opacity:.7;\">${escapeHtml(fb.copyright)}</div>` : "",
      ].join("");
      return `<tr><td style="background:${fb.bg}; color:${fb.color}; text-align:center; padding:12px;">${parts}</td></tr>`;
    }
    case "columns": {
      const widths = b.widths.map((w) => Math.round(w * 100));
      const cells = b.columns
        .map((col, idx) => {
          const inner = (col.children as any[]).map((child) => renderBlock(child as Block)).join("");
          return `<td class="stack" width="${widths[idx]}%" style="vertical-align:top; padding:0 ${b.gap / 2}px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tbody>${inner}</tbody>
            </table>
          </td>`;
        })
        .join("");
      const pad = `${b.padding.top}px ${b.padding.right}px ${b.padding.bottom}px ${b.padding.left}px`;
      return `<tr><td style="background:${b.background ?? "#ffffff"}; padding:${pad};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            <tr>
              ${cells}
            </tr>
          </tbody>
        </table>
      </td></tr>`;
    }
    default:
      return "";
  }
}

export function renderTemplateToHtml(template: Template): string {
  const bodyRows = template.blocks.map((b) => renderBlock(b as Block)).join("");
  const raw = `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${escapeHtml(template.name)}</title>
    <style>
      @media only screen and (max-width: 620px) {
        .container { width: 100% !important; }
        .stack { display:block !important; width:100% !important; }
      }
      body { margin:0; padding:0; background:#f4f4f5; }
    </style>
  </head>
  <body>
    <center style="width:100%; background:#f4f4f5;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" class="container" style="width:600px; margin:0 auto; background:#ffffff;">
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </center>
  </body>
</html>`;

  return juice(raw);
}


