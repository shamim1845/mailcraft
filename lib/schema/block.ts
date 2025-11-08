export type BlockId = string;

export type Alignment = "left" | "center" | "right" | "justify";

export type TextBlock = {
    id: BlockId;
    type: "text";
    html: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    align: Alignment;
    padding: { top: number; right: number; bottom: number; left: number };
};

export type ImageBlock = {
    id: BlockId;
    type: "image";
    url: string;
    alt: string;
    width: string; // px or %
    height: string; // auto or px
    align: Alignment;
    link?: string;
    padding: { top: number; right: number; bottom: number; left: number };
};

export type ButtonBlock = {
    id: BlockId;
    type: "button";
    text: string;
    url: string;
    bg: string;
    color: string;
    radius: number;
    paddingV: number;
    paddingH: number;
    align: Alignment | "full";
    fontSize: number;
};

export type DividerBlock = {
    id: BlockId;
    type: "divider";
    thickness: number;
    color: string;
    style: "solid" | "dashed" | "dotted";
    padding: { top: number; bottom: number };
};

export type SpacerBlock = {
    id: BlockId;
    type: "spacer";
    height: number;
};

export type IconBlock = {
    id: BlockId;
    type: "icon";
    icon: string;
    size: number;
    color: string;
    url?: string;
};

export type SocialBlock = {
    id: BlockId;
    type: "social";
    platforms: Array<{ key: "facebook" | "twitter" | "instagram" | "linkedin"; url: string }>;
    size: number;
    gap: number;
    align: Alignment;
};

export type ColumnsBlock = {
    id: BlockId;
    type: "columns";
    numColumns: 2 | 3;
    widths: number[]; // ratios sum to 1
    gap: number;
    background?: string;
    padding: { top: number; right: number; bottom: number; left: number };
    columns: Array<{ id: string; children: Block[] }>;
};

export type HeaderBlock = {
    id: BlockId;
    type: "header";
    logoUrl?: string;
    logoWidth?: number; // max width in pixels
    logoHeight?: number; // height in pixels (auto if not set)
    menu: Array<{ id: string; text: string; url: string }>;
    bg?: string;
    color?: string;
    padding: { top: number; right: number; bottom: number; left: number };
};

export type FooterBlock = {
    id: BlockId;
    type: "footer";
    company: string;
    address?: string;
    socials: Array<{ key: "facebook" | "twitter" | "instagram" | "linkedin"; url: string }>;
    unsubscribeText?: string;
    copyright?: string;
    bg?: string;
    color?: string;
    padding: { top: number; right: number; bottom: number; left: number };
};

export type Block =
    | TextBlock
    | ImageBlock
    | ButtonBlock
    | DividerBlock
    | SpacerBlock
    | IconBlock
    | SocialBlock
    | ColumnsBlock
    | HeaderBlock
    | FooterBlock;

export type Template = {
    id: string;
    name: string;
    blocks: Block[];
};


