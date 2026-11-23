import { SkyCodeBlockLanguageType } from './code-block-language-type';
import { highlightCodeBlock } from './code-block-languages';

describe('Code block languages', () => {
  it('should highlight a supported language', () => {
    const { html, languageType } = highlightCodeBlock(
      'const a = 1;',
      'typescript',
    );

    expect(html).toContain('<span class="hljs-keyword">const</span>');
    expect(languageType).toBe('typescript');
  });

  it('should highlight html as markup', () => {
    const { html, languageType } = highlightCodeBlock('<p>a</p>', 'html');

    expect(html).toContain('hljs-tag');
    expect(languageType).toBe('html');
  });

  it('should match language names case-insensitively', () => {
    expect(highlightCodeBlock('a', 'TypeScript').languageType).toBe(
      'typescript',
    );
  });

  it('should resolve highlight.js aliases of the supported languages', () => {
    const aliases: [string, SkyCodeBlockLanguageType][] = [
      ['ts', 'typescript'],
      ['TS', 'typescript'],
      ['js', 'javascript'],
      ['cs', 'csharp'],
      ['sh', 'bash'],
      ['yml', 'yaml'],
      ['bat', 'dos'],
      ['svg', 'xml'],
      ['txt', 'plaintext'],
    ];

    for (const [alias, languageType] of aliases) {
      expect(highlightCodeBlock('a', alias).languageType)
        .withContext(alias)
        .toBe(languageType);
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
    it(`should show plain text without a language type for ${languageType}`, () => {
      const result = highlightCodeBlock('<p>a</p>', languageType);

      expect(result.html).toBe('&lt;p&gt;a&lt;/p&gt;');
      expect(result.languageType).toBeUndefined();
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
