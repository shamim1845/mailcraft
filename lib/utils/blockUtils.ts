import { Block } from "../schema/block";

/**
 * Recursively finds a block by ID in the blocks array, including nested columns
 */
export function findBlockById(
  blocks: Block[],
  id: string
): Block | undefined {
  for (const block of blocks) {
    if (block.id === id) {
      return block;
    }
    if (block.type === "columns") {
      for (const col of block.columns) {
        const found = findBlockById(col.children, id);
        if (found) return found;
      }
    }
  }
  return undefined;
}

