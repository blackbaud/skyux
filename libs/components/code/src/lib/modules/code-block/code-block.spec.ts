import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { SkyCodeBlock } from './code-block';
import { SkyCodeBlockLanguageType } from './code-block-language-type';
import { CodeBlockFixture } from './fixtures/code-block-fixture';

// Renders its text through a binding, after the code block's content is checked.
@Component({
  selector: 'sky-code-block-snippet-test',
  template: '{{ snippet() }}',
})
class SnippetTest {
  protected readonly snippet = signal('const a = 1;');
}

@Component({
  imports: [SkyCodeBlock, SnippetTest],
  template: `<sky-code-block languageType="typescript"
    ><sky-code-block-snippet-test
  /></sky-code-block>`,
})
class ProjectedComponentTest {}

// Typed consumers can't pass this, but untyped values still fall back to xml.
const UNSUPPORTED_LANGUAGE = 'xml1' as SkyCodeBlockLanguageType;

describe('Code block component', () => {
  let fixture: ComponentFixture<CodeBlockFixture>;

  async function render(
    inputs: Partial<{
      code: string;
      fileName: string;
      hideCopyToClipboard: boolean;
      hideHeader: boolean;
      languageType: SkyCodeBlockLanguageType;
      projected: string;
    }>,
  ): Promise<void> {
    setInputs(inputs);
    await stabilize();
  }

  async function stabilize(): Promise<void> {
    fixture.autoDetectChanges();
    await fixture.whenStable();
  }

  function setInputs(inputs: Parameters<typeof render>[0]): void {
    const host = fixture.componentInstance;

    for (const [name, value] of Object.entries(inputs)) {
      host[name as keyof typeof inputs].set(value as never);
    }
  }

  function getCode(): HTMLElement {
    return fixture.nativeElement.querySelector(
      'pre.sky-code-block-output code',
    );
  }

  function getHeader(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.sky-code-block-header');
  }

  function getLanguageName(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.sky-code-block-language');
  }

  function getSeparator(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.sky-code-block-separator');
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeBlockFixture);
  });

  it('should highlight the code input', async () => {
    await render({ code: 'const a = 1;', languageType: 'typescript' });

    expect(getCode().querySelector('.hljs-keyword')).toHaveText('const');
  });

  it('should use projected content when code is not set', async () => {
    await render({ projected: '<p>Hi</p>' });

    expect(getCode().textContent).toBe('<p>Hi</p>');
    expect(getCode().querySelector('.hljs-tag')).toExist();
  });

  it('should display projected content on the first render', () => {
    fixture.componentInstance.projected.set('<p>Hi</p>');
    fixture.detectChanges();

    expect(getCode().textContent).toBe('<p>Hi</p>');
  });

  it('should normalize whitespace', async () => {
    // Blank lines at either end and the common 4-space indent are removed.
    await render({ code: '\n  \n    a\n   \n    b\n\n' });

    expect(getCode().textContent).toBe('a\n\nb');
  });

  it('should only remove leading whitespace that every line shares', async () => {
    // Tabs and spaces aren't interchangeable, so only `  ` is common here.
    await render({ code: '  \t\ta\n          b\n  c' });

    expect(getCode().textContent).toBe('\t\ta\n        b\nc');
  });

  it('should keep whitespace-only lines within the code', async () => {
    await render({ code: '    a\n      \n    b' });

    expect(getCode().textContent).toBe('a\n  \nb');
  });

  it('should not treat non-breaking spaces as indentation', async () => {
    await render({ code: ' a\n b' });

    expect(getCode().textContent).toBe(' a\n b');
  });

  it('should color CSS selectors and style Markdown emphasis', async () => {
    await render({ code: '.a #b:hover { color: red; }', languageType: 'css' });

    const selectorColor = getComputedStyle(
      getCode().querySelector('.hljs-selector-class') as HTMLElement,
    ).color;

    expect(selectorColor).not.toBe(getComputedStyle(getCode()).color);

    await render({ code: '*a* **b**', languageType: 'markdown' });

    expect(
      getComputedStyle(getCode().querySelector('.hljs-emphasis') as HTMLElement)
        .fontStyle,
    ).toBe('italic');
    expect(
      Number(
        getComputedStyle(getCode().querySelector('.hljs-strong') as HTMLElement)
          .fontWeight,
      ),
    ).toBeGreaterThan(Number(getComputedStyle(getCode()).fontWeight));
  });

  it('should show nothing for whitespace-only code', async () => {
    await render({ code: ' \n\t' });

    expect(getCode().textContent).toBe('');
  });

  it('should show text rendered by a projected component', async () => {
    const projectedFixture = TestBed.createComponent(ProjectedComponentTest);

    projectedFixture.autoDetectChanges();
    await projectedFixture.whenStable();

    expect(
      projectedFixture.nativeElement.querySelector('pre code').textContent,
    ).toBe('const a = 1;');
  });

  it('should keep tabs and trailing spaces within the code', async () => {
    await render({ code: '\n    a:\n    \tb  \n' });

    expect(getCode().textContent).toBe('a:\n\tb  ');
  });

  it('should keep the first line indented relative to the others', async () => {
    await render({ code: '\n    first()\n  second()\n' });

    expect(getCode().textContent).toBe('  first()\nsecond()');
  });

  it('should update when projected content changes', async () => {
    const writeTextSpy = spyOn(
      navigator.clipboard,
      'writeText',
    ).and.resolveTo();

    await render({ projected: 'a' });
    await render({ projected: 'b' });

    expect(getCode().textContent).toBe('b');

    fixture.nativeElement
      .querySelector('.sky-code-block-copy-button button')
      .click();
    await stabilize();

    expect(writeTextSpy).toHaveBeenCalledOnceWith('b');
  });

  it('should render markup in code as text', async () => {
    const code = '<script>alert(1)</script>';

    await render({ code });

    expect(getCode().querySelector('script')).toBeNull();
    expect(getCode().textContent).toBe(code);
  });

  it('should re-highlight when languageType changes', async () => {
    await render({ code: '{ "a": 1 }', languageType: 'typescript' });
    await render({ languageType: 'json' });

    expect(getCode().querySelector('.hljs-attr')).toExist();
    expect(getLanguageName()).toHaveText('JSON');
  });

  it('should show the file name and language name', async () => {
    await render({ code: 'a', fileName: 'app.ts', languageType: 'typescript' });

    expect(
      fixture.nativeElement.querySelector('.sky-code-block-file-name'),
    ).toHaveText('app.ts');
    expect(getLanguageName()).toHaveText('TypeScript');
    expect(getSeparator()).toHaveText('-');
  });

  it('should only separate the file name and language name when both are shown', async () => {
    await render({
      code: 'a',
      fileName: 'app.ts',
      languageType: UNSUPPORTED_LANGUAGE,
    });

    expect(getSeparator()).toBeNull();

    await render({ fileName: undefined, languageType: 'typescript' });

    expect(getSeparator()).toBeNull();
  });

  it('should style the header like Stache in the default theme', async () => {
    await render({ code: 'a', fileName: 'app.ts', languageType: 'typescript' });

    const fileNameStyle = getComputedStyle(
      fixture.nativeElement.querySelector('.sky-code-block-file-name'),
    );
    const separatorStyle = getComputedStyle(getSeparator() as HTMLElement);
    const languageStyle = getComputedStyle(getLanguageName() as HTMLElement);

    // The dash is styled like the file name.
    expect(separatorStyle.display).toBe('inline');
    expect(separatorStyle.color).toBe(fileNameStyle.color);
    expect(separatorStyle.fontStyle).toBe(fileNameStyle.fontStyle);
    expect(languageStyle.fontStyle).toBe('italic');
    expect(languageStyle.color).not.toBe(fileNameStyle.color);
  });

  it('should wrap a long file name to keep the copy button in view', async () => {
    await render({
      code: 'a',
      fileName: 'src/app/components/greeting/greeting.component.ts',
    });

    const codeBlock: HTMLElement =
      fixture.nativeElement.querySelector('sky-code-block');
    codeBlock.style.width = '200px';

    const header = getHeader() as HTMLElement;
    const button = fixture.nativeElement.querySelector(
      '.sky-code-block-copy-button',
    );

    expect(getComputedStyle(header).columnGap).toBe('5px');
    expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(
      codeBlock.getBoundingClientRect().right,
    );
  });

  it('should show an icon-only copy button labeled Copy', async () => {
    await render({ code: 'a' });

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.sky-code-block-copy-button button',
    );

    const labelId = button.getAttribute('aria-labelledby') ?? '';

    expect(button).toHaveCssClass('sky-btn-icon-borderless');
    expect(button.querySelector('sky-icon')).toExist();
    expect(document.getElementById(labelId)).toHaveText('Copy');
  });

  it('should name every language type in the header', async () => {
    const names: Record<SkyCodeBlockLanguageType, string> = {
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
      // From the resource strings.
      plaintext: 'Plain text',
      powershell: 'PowerShell',
      python: 'Python',
      sql: 'SQL',
      typescript: 'TypeScript',
      xml: 'XML',
      yaml: 'YAML',
    };

    for (const [languageType, name] of Object.entries(names)) {
      await render({
        code: 'a',
        languageType: languageType as SkyCodeBlockLanguageType,
      });

      expect(getLanguageName()?.textContent?.trim())
        .withContext(languageType)
        .toBe(name);
    }
  });

  it('should not show a language name for an unsupported languageType', async () => {
    await render({ code: 'a', languageType: UNSUPPORTED_LANGUAGE });

    expect(getLanguageName()).toBeNull();
  });

  it('should hide the header when hideHeader is true', async () => {
    await render({ code: 'a', fileName: 'app.ts', hideHeader: true });

    expect(getHeader()).toBeNull();
  });

  it('should hide the header when there is no file name, no language name and the copy button is hidden', async () => {
    await render({
      code: 'a',
      hideCopyToClipboard: true,
      languageType: UNSUPPORTED_LANGUAGE,
    });

    expect(getHeader()).toBeNull();

    await render({ fileName: 'app.ts' });

    expect(getHeader()).toExist();
  });

  it('should copy the normalized code', async () => {
    const writeTextSpy = spyOn(
      navigator.clipboard,
      'writeText',
    ).and.resolveTo();
    const announceSpy = spyOn(
      TestBed.inject(SkyLiveAnnouncerService),
      'announce',
    );

    await render({ projected: '\n    <p>Hi</p>\n  ' });

    fixture.nativeElement
      .querySelector('.sky-code-block-copy-button button')
      .click();
    await stabilize();

    expect(writeTextSpy).toHaveBeenCalledOnceWith('<p>Hi</p>');
    expect(announceSpy).toHaveBeenCalledOnceWith('Copied');
  });

  it('should announce when the code cannot be copied', async () => {
    const writeTextSpy = spyOn(navigator.clipboard, 'writeText').and.rejectWith(
      new DOMException('Denied', 'NotAllowedError'),
    );
    const announceSpy = spyOn(
      TestBed.inject(SkyLiveAnnouncerService),
      'announce',
    );

    await render({ code: 'a' });

    fixture.nativeElement
      .querySelector('.sky-code-block-copy-button button')
      .click();
    await stabilize();

    expect(writeTextSpy).toHaveBeenCalledOnceWith('a');
    expect(announceSpy).toHaveBeenCalledOnceWith('Unable to copy');
  });

  it('should make the code region keyboard focusable', async () => {
    await render({ code: 'a' });

    expect(
      fixture.nativeElement
        .querySelector('pre.sky-code-block-output code')
        .getAttribute('tabindex'),
    ).toBe('0');
  });

  it('should show an input-style focus ring inside the code region', async () => {
    await render({ code: 'a' });

    getCode().focus({ focusVisible: true });

    const outputStyle = getComputedStyle(
      getCode().parentElement as HTMLElement,
    );

    expect(getCode().matches(':focus-visible')).toBeTrue();
    // Default theme: the info-colored border of a focused input.
    expect(outputStyle.boxShadow).toContain(
      'rgb(0, 180, 241) 0px 0px 0px 1px inset',
    );
    expect(outputStyle.outlineColor).toBe('rgba(0, 0, 0, 0)');
    // The scrolling code area is clipped so its scrollbar can't cover the ring.
    expect(getComputedStyle(getCode()).clipPath).toBe('inset(1px)');
  });

  describe('a11y', () => {
    const longCode = `const message = '${'A long line that scrolls. '.repeat(20)}';`;

    it('should be accessible with a header', async () => {
      await render({
        code: longCode,
        fileName: 'message.ts',
        languageType: 'typescript',
      });

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible without a header', async () => {
      await render({ code: longCode, hideHeader: true });

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with a header and no copy button', async () => {
      await render({
        code: longCode,
        fileName: 'message.ts',
        hideCopyToClipboard: true,
      });

      expect(getHeader()).toExist();
      expect(
        fixture.nativeElement.querySelector('.sky-code-block-copy-button'),
      ).toBeNull();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    describe('in modern theme', () => {
      beforeEach(() => {
        document.body.classList.add('sky-theme-modern', 'sky-theme-brand-base');
      });

      afterEach(() => {
        document.body.classList.remove(
          'sky-theme-modern',
          'sky-theme-brand-base',
        );
      });

      it('should be accessible with a header', async () => {
        await render({
          code: longCode,
          fileName: 'message.ts',
          languageType: 'typescript',
        });

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should show the input focus ring tokens inside the code region', async () => {
        document.body.classList.add('sky-theme-mode-light');
        await render({ code: 'a' });

        getCode().focus({ focusVisible: true });
        const boxShadow = getComputedStyle(
          getCode().parentElement as HTMLElement,
        ).boxShadow;
        const clipPath = getComputedStyle(getCode()).clipPath;
        document.body.classList.remove('sky-theme-mode-light');

        const ringWidth = /0px 0px 0px (\d+px) inset$/.exec(boxShadow)?.[1];

        expect(boxShadow).not.toContain('rgb(0, 180, 241)');
        expect(ringWidth).toBeDefined();
        expect(clipPath).toBe(`inset(${ringWidth})`);
      });

      it('should style Markdown emphasis and strong text with the font tokens', async () => {
        await render({ code: '*a* **b**', languageType: 'markdown' });

        expect(
          getComputedStyle(
            getCode().querySelector('.hljs-emphasis') as HTMLElement,
          ).fontStyle,
        ).toBe('italic');
        expect(
          getComputedStyle(
            getCode().querySelector('.hljs-strong') as HTMLElement,
          ).fontWeight,
        ).toBe('700');
      });

      it('should separate the file name and language name with a dash', async () => {
        await render({
          code: 'a',
          fileName: 'app.ts',
          languageType: 'typescript',
        });

        expect(getComputedStyle(getSeparator() as HTMLElement).display).toBe(
          'inline',
        );
        expect(
          getComputedStyle(getLanguageName() as HTMLElement).fontStyle,
        ).toBe('normal');
      });
    });
  });
});
