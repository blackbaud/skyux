/**
 * @internal
 */
export const SKY_CODE_HIGHLIGHT_LANGUAGES = [
  'html',
  'markup',
  'javascript',
  'js',
  'css',
  'scss',
  'typescript',
  'ts',
] as const;

/**
 * @internal
 */
export type SkyCodeHighlightLanguage =
  (typeof SKY_CODE_HIGHLIGHT_LANGUAGES)[number];

/**
 * @internal
 */
export function assertCodeHighlightLanguage(
  value: string | undefined,
): asserts value is SkyCodeHighlightLanguage {
  if (
    !SKY_CODE_HIGHLIGHT_LANGUAGES.includes(value as SkyCodeHighlightLanguage)
  ) {
    throw new Error(`Value "${value}" is not a supported language type.`);
  }
}
