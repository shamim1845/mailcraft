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
      const socialLabels: Record<string, string> = {
        facebook: "Facebook",
        twitter: "Twitter",
        instagram: "Instagram",
        linkedin: "LinkedIn",
      };
      const socialColors: Record<string, string> = {
        facebook: "#1877F2",
        twitter: "#1DA1F2",
        instagram: "#E4405F",
        linkedin: "#0077B5",
      };
      const icons = b.platforms
        .map(
          (p) =>
            `<a href="${escapeHtml(p.url)}" style="display:inline-block; width:${b.size}px; height:${b.size}px; margin-right:${b.gap}px; text-align:center; line-height:${b.size}px; background:${socialColors[p.key] || "#6b7280"}; color:#ffffff; text-decoration:none; border-radius:50%; font-size:${Math.max(10, b.size * 0.5)}px; font-weight:bold;" title="${socialLabels[p.key] || p.key}">${(p.key[0] || "?").toUpperCase()}</a>`
        )
        .join("");
      const alignStyle =
        b.align === "center"
          ? "text-align:center;"
          : b.align === "right"
            ? "text-align:right;"
            : "text-align:left;";
      return `<tr><td style="${alignStyle} padding:8px 0;">${icons}</td></tr>`;
    }
    case "icon": {
      const iconBlock = b as any;
      const size = iconBlock.size || 24;
      const color = iconBlock.color || "#6b7280";
      const iconType = iconBlock.icon || "circle";
      let shape = "";
      if (iconType === "square") {
        shape = `<div style="width:${size}px; height:${size}px; background:${color}; border-radius:4px; display:inline-block;"></div>`;
      } else if (iconType === "star") {
        shape = `<span style="font-size:${size}px; color:${color}; display:inline-block;">★</span>`;
      } else {
        shape = `<div style="width:${size}px; height:${size}px; background:${color}; border-radius:50%; display:inline-block;"></div>`;
      }
      const linked = iconBlock.url
        ? `<a href="${escapeHtml(iconBlock.url)}" style="text-decoration:none;">${shape}</a>`
        : shape;
      return `<tr><td style="text-align:center; padding:8px 0;">${linked}</td></tr>`;
    }
    case "header": {
      const hb = b as any;
      const pad = `${hb.padding.top}px ${hb.padding.right}px ${hb.padding.bottom}px ${hb.padding.left}px`;
      const logoWidth = hb.logoWidth ?? 200;
      const logoHeight = hb.logoHeight;
      const logoStyle = `display:block; max-width:${logoWidth}px; width:100%; ${logoHeight ? `height:${logoHeight}px; object-fit:contain;` : 'height:auto;'}`;
      const logo = hb.logoUrl ? `<img src="${escapeHtml(hb.logoUrl)}" alt="logo" style="${logoStyle}"/>` : `<span style="font-size:14px;">Logo</span>`;
      const menu = hb.menu
        .map((m: any) => `<a href="${escapeHtml(m.url)}" style="color:${hb.color}; text-decoration:none; margin-left:12px; font-size:14px; white-space:nowrap;">${escapeHtml(m.text)}</a>`)
        .join("");
      return `<tr><td style="background:${hb.bg}; color:${hb.color}; padding:${pad};"><table role=\"presentation\" width=\"100%\"><tr><td align=\"left\" style=\"max-width:${logoWidth}px;\">${logo}</td><td align=\"right\">${menu}</td></tr></table></td></tr>`;
    }
    case "footer": {
      const fb = b as any;
      const pad = `${fb.padding?.top || 12}px ${fb.padding?.right || 12}px ${fb.padding?.bottom || 12}px ${fb.padding?.left || 12}px`;
      const socialColors: Record<string, string> = {
        facebook: "#1877F2",
        twitter: "#1DA1F2",
        instagram: "#E4405F",
        linkedin: "#0077B5",
      };
      const socialLabels: Record<string, string> = {
        facebook: "Facebook",
        twitter: "Twitter",
        instagram: "Instagram",
        linkedin: "LinkedIn",
      };
      const socials = fb.socials
        .map(
          (s: any) =>
            `<a href="${escapeHtml(s.url)}" style="display:inline-block; width:32px; height:32px; line-height:32px; text-align:center; background:${socialColors[s.key] || "#6b7280"}; color:#ffffff; text-decoration:none; margin:0 4px; border-radius:50%; font-size:14px; font-weight:bold;" title="${socialLabels[s.key] || s.key}">${(s.key[0] || "?").toUpperCase()}</a>`
        )
        .join("");
      const parts = [
        `<div style="font-weight:600; font-size:14px;">${escapeHtml(fb.company)}</div>`,
        fb.address
          ? `<div style="opacity:.7; font-size:12px; margin-top:4px;">${escapeHtml(fb.address)}</div>`
          : "",
        fb.socials.length > 0
          ? `<div style="margin-top:12px;">${socials}</div>`
          : "",
        fb.unsubscribeText
          ? `<div style="margin-top:12px; opacity:.7; font-size:11px;">${escapeHtml(fb.unsubscribeText)}</div>`
          : "",
        fb.copyright
          ? `<div style="margin-top:8px; opacity:.7; font-size:11px;">${escapeHtml(fb.copyright)}</div>`
          : "",
      ]
        .filter(Boolean)
        .join("");
      return `<tr><td style="background:${fb.bg || "#f4f4f5"}; color:${fb.color || "#111111"}; text-align:center; padding:${pad};">${parts}</td></tr>`;
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
  const raw = `
<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${escapeHtml(template.name)}</title>
    <style>
      @media only screen and (max-width: 620px) {
        .container { width: 100% !important; max-width: 100% !important; }
        .stack { display:block !important; width:100% !important; }
        table[role="presentation"] { width: 100% !important; }
        td[class="stack"] { display: block !important; width: 100% !important; padding: 8px 0 !important; }
      }
      body { margin:0; padding:0; background:#f4f4f5; font-family: Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
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


