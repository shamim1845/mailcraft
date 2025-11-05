import { nanoid } from "nanoid";
import {
    Block,
    ButtonBlock,
    DividerBlock,
    ImageBlock,
    IconBlock,
    SocialBlock,
    SpacerBlock,
    TextBlock,
    HeaderBlock,
    FooterBlock,
} from "../schema/block";

export function createDefaultBlock(key: string): Block {
    switch (key) {
        case "text": {
            const b: TextBlock = {
                id: nanoid(),
                type: "text",
                html: "<p>Edit this text</p>",
                fontFamily: "Arial",
                fontSize: 16,
                color: "#111111",
                align: "left",
                padding: { top: 8, right: 8, bottom: 8, left: 8 },
            };
            return b;
        }
        case "image": {
            const b: ImageBlock = {
                id: nanoid(),
                type: "image",
                url: "https://placehold.co/600x300",
                alt: "",
                width: "100%",
                height: "auto",
                align: "center",
                link: undefined,
                padding: { top: 8, right: 8, bottom: 8, left: 8 },
            };
            return b;
        }
        case "button": {
            const b: ButtonBlock = {
                id: nanoid(),
                type: "button",
                text: "Click me",
                url: "#",
                bg: "#111111",
                color: "#ffffff",
                radius: 6,
                paddingV: 10,
                paddingH: 16,
                align: "left",
                fontSize: 16,
            };
            return b;
        }
        case "divider": {
            const b: DividerBlock = {
                id: nanoid(),
                type: "divider",
                thickness: 1,
                color: "#e4e4e7",
                style: "solid",
                padding: { top: 8, bottom: 8 },
            };
            return b;
        }
        case "spacer": {
            const b: SpacerBlock = {
                id: nanoid(),
                type: "spacer",
                height: 16,
            };
            return b;
        }
        case "social": {
            const b: SocialBlock = {
                id: nanoid(),
                type: "social",
                platforms: [
                    { key: "facebook", url: "#" },
                    { key: "twitter", url: "#" },
                    { key: "instagram", url: "#" },
                ],
                size: 20,
                gap: 12,
                align: "center",
            };
            return b;
        }
        case "columns-2": {
            return {
                id: nanoid(),
                type: "columns",
                numColumns: 2,
                widths: [0.5, 0.5],
                gap: 16,
                background: "#ffffff",
                padding: { top: 8, right: 8, bottom: 8, left: 8 },
                columns: [
                    { id: nanoid(), children: [] },
                    { id: nanoid(), children: [] },
                ],
            } as Block;
        }
        case "columns-3": {
            return {
                id: nanoid(),
                type: "columns",
                numColumns: 3,
                widths: [1 / 3, 1 / 3, 1 / 3],
                gap: 16,
                background: "#ffffff",
                padding: { top: 8, right: 8, bottom: 8, left: 8 },
                columns: [
                    { id: nanoid(), children: [] },
                    { id: nanoid(), children: [] },
                    { id: nanoid(), children: [] },
                ],
            } as Block;
        }
        case "icon": {
            const b: IconBlock = {
                id: nanoid(),
                type: "icon",
                icon: "circle",
                size: 24,
                color: "#e5e7eb",
                url: "#",
            };
            return b;
        }
        case "header": {
            const b: HeaderBlock = {
                id: nanoid(),
                type: "header",
                logoUrl: "",
                menu: [
                    { id: nanoid(), text: "Home", url: "#" },
                    { id: nanoid(), text: "About", url: "#" },
                ],
                bg: "#ffffff",
                color: "#111111",
                padding: { top: 12, right: 12, bottom: 12, left: 12 },
            };
            return b;
        }
        case "footer": {
            const b: FooterBlock = {
                id: nanoid(),
                type: "footer",
                company: "Company Inc.",
                address: "123 Main St, City",
                socials: [
                    { key: "facebook", url: "#" },
                    { key: "twitter", url: "#" },
                ],
                unsubscribeText: "Unsubscribe",
                copyright: `© ${new Date().getFullYear()} Company Inc.`,
                bg: "#f4f4f5",
                color: "#111111",
            };
            return b;
        }
        default:
            return createDefaultBlock("text");
    }
}


