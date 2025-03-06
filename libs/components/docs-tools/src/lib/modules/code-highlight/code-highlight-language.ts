/**
 * @internal
 */
export const SKY_DOCS_CODE_HIGHLIGHT_LANGUAGES = [
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
export type SkyDocsCodeHighlightLanguage =
  (typeof SKY_DOCS_CODE_HIGHLIGHT_LANGUAGES)[number];

/**
 * @internal
 */
export function assertCodeHighlightLanguage(
  value: string | undefined,
): asserts value is SkyDocsCodeHighlightLanguage {
  if (
    !SKY_DOCS_CODE_HIGHLIGHT_LANGUAGES.includes(
      value as SkyDocsCodeHighlightLanguage,
    )
  ) {
    throw new Error(`Value "${value}" is not a supported language type.`);
  }
}
