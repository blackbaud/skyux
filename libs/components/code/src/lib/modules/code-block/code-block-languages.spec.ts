// cspell:ignore asciidoc gherkin
import { SkyCodeBlockLanguageType } from './code-block-language-type';
import { highlightCodeBlock } from './code-block-languages';

// The label shown for every language type.
const LABELS: Record<SkyCodeBlockLanguageType, string> = {
  arduino: 'Arduino',
  asciidoc: 'AsciiDoc',
  bash: 'Bash',
  csharp: 'C#',
  css: 'CSS',
  dos: 'Batch',
  gherkin: 'Gherkin',
  html: 'HTML',
  http: 'HTTP',
  java: 'Java',
  javascript: 'JavaScript',
  json: 'JSON',
  markdown: 'Markdown',
  php: 'PHP',
  plaintext: 'Plain text',
  powershell: 'PowerShell',
  python: 'Python',
  sql: 'SQL',
  typescript: 'TypeScript',
  xml: 'XML',
  yaml: 'YAML',
};

describe('Code block languages', () => {
  it('should highlight a supported language', () => {
    const { displayName, html } = highlightCodeBlock(
      'const a = 1;',
      'typescript',
    );

    expect(html).toContain('<span class="hljs-keyword">const</span>');
    expect(displayName).toBe('TypeScript');
  });

  it('should label every language type', () => {
    for (const [languageType, label] of Object.entries(LABELS)) {
      expect(highlightCodeBlock('a', languageType).displayName)
        .withContext(languageType)
        .toBe(label);
    }
  });

  it('should highlight html as markup', () => {
    expect(highlightCodeBlock('<p>a</p>', 'html').html).toContain('hljs-tag');
  });

  it('should match language names case-insensitively', () => {
    expect(highlightCodeBlock('a', 'TypeScript').displayName).toBe(
      'TypeScript',
    );
  });

  it('should resolve highlight.js aliases of the supported languages', () => {
    for (const [alias, displayName] of [
      ['ts', 'TypeScript'],
      ['TS', 'TypeScript'],
      ['js', 'JavaScript'],
      ['cs', 'C#'],
      ['sh', 'Bash'],
      ['yml', 'YAML'],
    ]) {
      expect(highlightCodeBlock('a', alias).displayName)
        .withContext(alias)
        .toBe(displayName);
    }
  });

  it('should highlight an alias in its language', () => {
    expect(highlightCodeBlock('const a = 1;', 'ts').html).toContain(
      '<span class="hljs-keyword">const</span>',
    );
  });

  for (const languageType of [
    undefined,
    'xml1',
    'markup',
    'constructor',
    '__proto__',
  ]) {
    it(`should show plain text without a display name for ${languageType}`, () => {
      const { displayName, html } = highlightCodeBlock(
        '<p>a</p>',
        languageType,
      );

      expect(html).toBe('&lt;p&gt;a&lt;/p&gt;');
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
