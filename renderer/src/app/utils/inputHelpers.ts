import type { KeyboardEvent } from "react";

/**
 * Prevents invalid characters in <input type="number"> fields.
 * Blocks: 'e', 'E', '+', '-'
 *
 * Use on non-negative numeric fields (quantities, weights, charges,
 * durations, ports, speeds, stock counts, etc.).
 *
 * Usage: <input type="number" onKeyDown={blockNonNumeric} ... />
 */
export function blockNonNumeric(e: KeyboardEvent<HTMLInputElement>): void {
  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
}
