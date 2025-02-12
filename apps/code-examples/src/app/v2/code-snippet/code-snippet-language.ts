export const SKY_CODE_SNIPPET_LANGUAGES = ['html', 'js', 'scss', 'ts'] as const;

export type SkyCodeSnippetLanguage =
  (typeof SKY_CODE_SNIPPET_LANGUAGES)[number];

export function assertCodeSnippetLanguage(
  value: string | undefined,
): asserts value is SkyCodeSnippetLanguage {
  if (!SKY_CODE_SNIPPET_LANGUAGES.includes(value as SkyCodeSnippetLanguage)) {
    throw new Error(`Value "${value}" is not a supported language type.`);
  }
}
