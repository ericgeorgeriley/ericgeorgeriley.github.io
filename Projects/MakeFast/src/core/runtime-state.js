/** Shared runtime identity for source-compatible modularization.
 * All cross-feature bindings flow through this one explicit namespace, not window.
 * Later migrations can replace MF references with direct module imports. */
export const MF = Object.create(null);
