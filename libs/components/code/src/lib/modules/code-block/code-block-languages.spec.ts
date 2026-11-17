// cspell:ignore asciidoc gherkin
import { highlightCodeBlock } from './code-block-languages';

const SUPPORTED_LANGUAGES = [
  'arduino',
  'asciidoc',
  'bash',
  'csharp',
  'css',
  'dos',
  'gherkin',
  'http',
  'java',
  'javascript',
  'json',
  'markdown',
  'php',
  'plaintext',
  'powershell',
  'python',
  'sql',
  'typescript',
  'xml',
  'yaml',
];

describe('Code block languages', () => {
  it('should highlight a supported language', () => {
    const { displayName, html } = highlightCodeBlock(
      'const a = 1;',
      'typescript',
    );

    expect(html).toContain('<span class="hljs-keyword">const</span>');
    expect(displayName).toBe('TypeScript');
  });

  it('should support the languages found in existing code blocks', () => {
    for (const language of SUPPORTED_LANGUAGES) {
      expect(highlightCodeBlock('a', language).displayName)
        .withContext(language)
        .toEqual(jasmine.any(String));
    }
  });

  it('should match language names case-insensitively', () => {
    expect(highlightCodeBlock('a', 'TypeScript').displayName).toBe(
      'TypeScript',
    );
  });

  for (const languageType of [undefined, 'xml1', 'ts', 'constructor']) {
    it(`should highlight as xml without a display name for ${languageType}`, () => {
      const { displayName, html } = highlightCodeBlock(
        '<p>a</p>',
        languageType,
      );

      expect(html).toContain('hljs-tag');
      expect(displayName).toBeUndefined();
    });
  }

  it('should highlight languages embedded in another language', () => {
    const { html } = highlightCodeBlock('<script>const a = 1;</script>', 'xml');

    expect(html).toContain('<span class="hljs-keyword">const</span>');
  });

  it('should escape the code', () => {
    expect(highlightCodeBlock('a < b && c', 'plaintext').html).toBe(
      'a &lt; b &amp;&amp; c',
    );
  });
});
