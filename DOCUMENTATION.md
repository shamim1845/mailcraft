# MailCraft - Technical Documentation

## Architecture Overview

MailCraft is built as a single-page application using Next.js 16 with the App Router. The application follows a component-based architecture with clear separation of concerns.

## Project Structure

```
mailcraft/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main entry point
│   └── globals.css        # Global styles
├── components/
│   ├── builder/           # Email builder components
│   │   ├── BuilderPage.tsx    # Main builder container
│   │   ├── Canvas.tsx         # Drag-and-drop canvas
│   │   ├── LeftPanel.tsx      # Component library
│   │   ├── RightPanel.tsx     # Properties editor
│   │   ├── TopBar.tsx         # Toolbar with actions
│   │   ├── TextEditor.tsx     # Rich text editor
│   │   ├── SocialIcons.tsx    # Social media icons
│   │   └── forms/             # Form components
│   │       ├── ColorPicker.tsx
│   │       ├── ImageUpload.tsx
│   │       └── PaddingSpacing.tsx
│   └── ui/                # Shared UI components
│       └── ToastProvider.tsx
├── lib/
│   ├── export/            # Export functionality
│   │   ├── renderEmail.ts     # HTML email renderer
│   │   ├── download.ts        # File download
│   │   ├── preview.ts         # Preview window
│   │   └── clipboard.ts       # Clipboard copy
│   ├── schema/            # TypeScript type definitions
│   │   └── block.ts           # Block type system
│   ├── state/             # State management
│   │   └── store.ts           # Zustand store
│   └── utils/             # Utility functions
│       ├── defaults.ts        # Default block values
│       └── blockUtils.ts      # Block helper functions
└── public/                # Static assets
```

## Component Architecture

### BuilderPage

The main container component that orchestrates the three-panel layout:

- **LeftPanel**: Component library for adding blocks
- **Canvas**: Central drag-and-drop area
- **RightPanel**: Properties editor for selected blocks

### Canvas Component

- Uses `@dnd-kit` for drag-and-drop functionality
- Renders blocks using `BlockPreview` component
- Handles block selection, deletion, and duplication
- Supports nested column layouts

### Block System

Each block type is defined in `lib/schema/block.ts`:

- **TextBlock**: Rich text content
- **ImageBlock**: Images with links and resizing
- **ButtonBlock**: Call-to-action buttons
- **HeaderBlock**: Logo and navigation menu
- **FooterBlock**: Company info and social links
- **ColumnsBlock**: Multi-column layouts
- **DividerBlock**, **SpacerBlock**: Layout elements
- **SocialBlock**, **IconBlock**: Decorative elements

## State Management

### Zustand Store (`lib/state/store.ts`)

The application uses Zustand with Immer middleware for state management:

```typescript
type BuilderState = {
  viewport: "desktop" | "mobile";
  selectedId?: string;
  history: HistoryState; // Undo/redo support
  // ... actions
};
```

**Key Features:**

- **History Management**: Implements undo/redo with past/present/future states
- **Auto-save**: Automatically saves to localStorage on every change
- **Immer Integration**: Allows mutable-style updates while maintaining immutability
- **Block Operations**: Add, delete, duplicate, move, and update blocks
- **Nested Operations**: Supports blocks within column layouts

**State Flow:**

1. User action triggers store action
2. Immer creates immutable update
3. State updates trigger React re-renders
4. Changes auto-save to localStorage
5. History is updated for undo/redo

## Technical Decisions

### 1. Email HTML Generation

**Decision**: Use table-based layouts with inline CSS

**Rationale**:

- Email clients have inconsistent CSS support
- Tables provide the most reliable layout method
- Inline CSS ensures styles are preserved
- Juice library inlines all CSS automatically

**Implementation**: `lib/export/renderEmail.ts` converts block data to email-compatible HTML

### 2. Rich Text Editor

**Decision**: Use TipTap (ProseMirror-based)

**Rationale**:

- Lightweight and extensible
- Good React integration
- Supports custom extensions
- Outputs clean HTML

**Implementation**: `components/builder/TextEditor.tsx` wraps TipTap with DOMPurify for security

### 3. Drag and Drop

**Decision**: Use @dnd-kit instead of react-beautiful-dnd

**Rationale**:

- Better TypeScript support
- More flexible API
- Smaller bundle size
- Better accessibility

**Implementation**: `components/builder/Canvas.tsx` uses SortableContext for block reordering

### 4. State Management

**Decision**: Zustand instead of Redux or Context API

**Rationale**:

- Minimal boilerplate
- Excellent TypeScript support
- Small bundle size
- Easy to test
- Immer middleware for immutable updates

### 5. Image Handling

**Decision**: Base64 encoding for small images, external URLs for large

**Rationale**:

- Base64 ensures images work in all email clients
- Small images (<2MB) don't significantly bloat HTML
- Large images should use CDN for performance
- User can choose based on their needs

### 6. Color Picker

**Decision**: Custom implementation with debouncing

**Rationale**:

- Full control over UX
- Debouncing prevents excessive state updates
- Immediate visual feedback with debounced saves
- startTransition for non-urgent updates

**Implementation**: `components/builder/forms/ColorPicker.tsx` uses React's startTransition to prevent cascading renders

### 7. Type Safety

**Decision**: Strict TypeScript with union types for blocks

**Rationale**:

- Catches errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring

**Challenge**: Union types for blocks required careful type narrowing (see PaddingSpacing component)

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Store Action
    ↓
Immer Update (Immutable)
    ↓
State Update
    ↓
React Re-render
    ↓
localStorage Auto-save
    ↓
History Update (Undo/Redo)
```

## Export Process

1. **Template to Blocks**: Current template contains array of blocks
2. **Block Rendering**: Each block type has a render function
3. **HTML Generation**: Blocks converted to table-based HTML
4. **CSS Inlining**: Juice library inlines all CSS
5. **Output**: Email-compatible HTML string

## Performance Optimizations

1. **Debounced Updates**: Color picker and text inputs use debouncing
2. **startTransition**: Non-urgent state updates use React's startTransition
3. **Memoization**: useCallback for event handlers
4. **Lazy Loading**: Components loaded on demand
5. **Image Optimization**: Base64 only for small images

## Security Considerations

1. **DOMPurify**: Rich text editor output is sanitized
2. **HTML Escaping**: User input is escaped in email export
3. **XSS Prevention**: All user content is sanitized before rendering

## Future Improvements

1. **Template Library**: Pre-built templates
2. **Email Service Integration**: Direct export to Mailchimp, SendGrid
3. **Advanced Layouts**: More flexible column options
4. **Image Optimization**: Automatic image compression
5. **Collaboration**: Real-time editing with multiple users
6. **Version Control**: Template versioning system
7. **A/B Testing**: Built-in email testing tools
