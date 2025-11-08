import juice from "juice";
import { Block, Template } from "../schema/block";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getSocialIconSvg(platform: string, size: number, color: string): string {
  const platformLower = platform.toLowerCase();
  const svgPaths: Record<string, string> = {
    facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    twitter: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    github: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
    tiktok: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
    pinterest: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z",
    snapchat: "M12.206 0C8.8 0 5.413.528 3.617 3.568c-.125.22-.197.467-.197.72 0 .353.17.675.432.872.22.165.487.26.768.26.096 0 .19-.014.282-.038.412-.11.825-.22 1.238-.315.28-.064.56-.13.84-.17.28-.04.56-.07.84-.09.28-.02.56-.03.84-.03s.56.01.84.03c.28.02.56.05.84.09.28.04.56.106.84.17.413.095.826.205 1.238.315.092.024.186.038.282.038.281 0 .548-.095.768-.26.262-.197.432-.52.432-.872 0-.253-.072-.5-.197-.72C18.587.528 15.2 0 12.206 0zm-1.5 4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm3 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-1.5 3c-2.33 0-4.5 1.34-5.5 3.5 0 0-.5 1.5.5 2.5s2.5 1 3.5 1c.5 0 1 .5 1.5 1s1 1 1.5 1 1-.5 1.5-1 1-1 1.5-1c1 0 2.5 0 3.5-1s.5-2.5.5-2.5c-1-2.16-3.17-3.5-5.5-3.5z"
  };

  const path = svgPaths[platformLower];
  if (!path) {
    // Fallback to text if platform not found
    return `<span style="color:#ffffff; font-size:${Math.max(10, size * 0.5)}px; font-weight:bold; line-height:${size}px; display:inline-block; vertical-align:middle;">${(platform[0] || "?").toUpperCase()}</span>`;
  }

  // Calculate icon size (slightly smaller than container for padding)
  const iconSize = Math.round(size * 0.7);
  return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; width:${iconSize}px; height:${iconSize}px; vertical-align:middle;"><path d="${path}"/></svg>`;
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
        youtube: "YouTube",
        github: "GitHub",
        tiktok: "TikTok",
        pinterest: "Pinterest",
        snapchat: "Snapchat",
      };
      const socialColors: Record<string, string> = {
        facebook: "#1877F2",
        twitter: "#1DA1F2",
        instagram: "#E4405F",
        linkedin: "#0077B5",
        youtube: "#FF0000",
        github: "#181717",
        tiktok: "#000000",
        pinterest: "#BD081C",
        snapchat: "#FFFC00",
      };
      const icons = b.platforms
        .map(
          (p) => {
            const color = socialColors[p.key] || "#6b7280";
            const svgIcon = getSocialIconSvg(p.key, b.size, "#ffffff");
            return `<a href="${escapeHtml(p.url)}" style="display:inline-block; width:${b.size}px; height:${b.size}px; margin-right:${b.gap}px; text-align:center; line-height:${b.size}px; background:${color}; color:#ffffff; text-decoration:none; border-radius:50%; vertical-align:middle;" title="${socialLabels[p.key] || p.key}">${svgIcon}</a>`;
          }
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
        youtube: "#FF0000",
        github: "#181717",
        tiktok: "#000000",
        pinterest: "#BD081C",
        snapchat: "#FFFC00",
      };
      const socialLabels: Record<string, string> = {
        facebook: "Facebook",
        twitter: "Twitter",
        instagram: "Instagram",
        linkedin: "LinkedIn",
        youtube: "YouTube",
        github: "GitHub",
        tiktok: "TikTok",
        pinterest: "Pinterest",
        snapchat: "Snapchat",
      };
      const socials = fb.socials
        .map(
          (s: any) => {
            const color = socialColors[s.key] || "#6b7280";
            const svgIcon = getSocialIconSvg(s.key, 24, "#ffffff");
            return `<a href="${escapeHtml(s.url)}" style="display:inline-block; width:32px; height:32px; line-height:32px; text-align:center; background:${color}; color:#ffffff; text-decoration:none; margin:0 4px; border-radius:50%; vertical-align:middle;" title="${socialLabels[s.key] || s.key}">${svgIcon}</a>`;
          }
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


