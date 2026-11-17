import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { SkyCodeBlockTestComponent } from './fixtures/code-block.component.fixture';

describe('Code block component', () => {
  let fixture: ComponentFixture<SkyCodeBlockTestComponent>;

  async function render(
    inputs: Partial<{
      code: string;
      fileName: string;
      hideCopyToClipboard: boolean;
      hideHeader: boolean;
      languageType: string;
      projected: string;
    }>,
  ): Promise<void> {
    setInputs(inputs);
    await stabilize();
  }

  // Highlighting finishes asynchronously, after projected content is read, so
  // keep rendering until both are done.
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

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyCodeBlockTestComponent);
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

  it('should normalize whitespace', async () => {
    // The tab becomes 2 spaces, then the common 4-space indent is removed.
    await render({ code: '\n\n    a\n\t    b   \n\n' });

    expect(getCode().textContent).toBe('a\n  b');
  });

  it('should render markup in code as text', async () => {
    const code = '<script>alert(1)</script>';

    setInputs({ code });
    fixture.detectChanges();

    expect(getCode().querySelector('script')).toBeNull();
    expect(getCode().textContent).toBe(code);

    await stabilize();

    expect(getCode().querySelector('script')).toBeNull();
    expect(getCode().textContent).toBe(code);
  });

  it('should re-highlight when languageType changes', async () => {
    await render({ code: '{ "a": 1 }', languageType: 'ts' });
    await render({ languageType: 'json' });

    expect(getCode().querySelector('.hljs-attr')).toExist();

    setInputs({ code: 'const a = 1;', languageType: 'json' });
    fixture.detectChanges();
    setInputs({ languageType: 'ts' });
    await stabilize();

    expect(getCode().querySelector('.hljs-keyword')).toHaveText('const');
    expect(getLanguageName()).toHaveText('TypeScript');
  });

  it('should show the file name and language name', async () => {
    await render({ code: 'a', fileName: 'app.ts', languageType: 'ts' });

    expect(
      fixture.nativeElement.querySelector('.sky-code-block-file-name'),
    ).toHaveText('app.ts');
    expect(getLanguageName()).toHaveText('TypeScript');
  });

  it('should not show a language name for unknown or unset languageType', async () => {
    await render({ code: 'a' });

    expect(getLanguageName()).toBeNull();

    await render({ languageType: 'xml1' });

    expect(getLanguageName()).toBeNull();
  });

  it('should hide the header when hideHeader is true', async () => {
    await render({ code: 'a', fileName: 'app.ts', hideHeader: true });

    expect(getHeader()).toBeNull();
  });

  it('should hide the header when there is no file name, no language name and the copy button is hidden', async () => {
    await render({ code: 'a', hideCopyToClipboard: true });

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

  it('should make the code region keyboard focusable', async () => {
    await render({ code: 'a' });

    expect(
      fixture.nativeElement
        .querySelector('pre.sky-code-block-output')
        .getAttribute('tabindex'),
    ).toBe('0');
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
    });
  });
});
