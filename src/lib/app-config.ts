/**
 * Project identity — the single place setup.sh rewrites.
 * Import APP_NAME instead of hardcoding the project name anywhere else.
 */
export const APP_NAME = '{{PROJECT_NAME}}';
/** One sentence on what the product is, from docs/PRD.md "What it is". Set in the first agent session. */
export const APP_DESCRIPTION = APP_NAME;
