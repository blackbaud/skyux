import {
  Component,
  ComponentRef,
  EnvironmentInjector,
  createComponent,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyCode } from '@skyux/code';

import { SkyDocsMarkdownHtmlDirective } from './markdown-html.directive';

@Component({
  imports: [SkyDocsMarkdownHtmlDirective],
  template: `<div [skyDocsMarkdownHtml]="html()"></div>`,
})
class MarkdownHtmlTestComponent {
  public readonly html = signal('');
}

describe('Markdown HTML directive', () => {
  let fixture: ComponentFixture<MarkdownHtmlTestComponent>;
  let destroySpy: jasmine.Spy;

  function getHostElement(): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      'div',
    ) as HTMLElement;
  }

  function getCodeElements(): HTMLElement[] {
    return Array.from(
      getHostElement().querySelectorAll<HTMLElement>('sky-code code'),
    );
  }

  function countDestroyedCodeRefs(): number {
    return destroySpy.calls
      .all()
      .filter(
        (call) =>
          (call.object as ComponentRef<unknown>).instance instanceof SkyCode,
      ).length;
  }

  async function render(html: string): Promise<void> {
    fixture.componentInstance.html.set(html);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownHtmlTestComponent);

    // Spy on the concrete ComponentRef class that createComponent() returns.
    const probeRef: ComponentRef<SkyCode> = createComponent(SkyCode, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
    });
    destroySpy = spyOn(
      Object.getPrototypeOf(probeRef),
      'destroy',
    ).and.callThrough();
    probeRef.destroy();
    destroySpy.calls.reset();
  });

  it('should render inline code as code components', async () => {
    await render(
      '<p>Set <code class="sky-docs-codespan">foo</code> to a <code class="sky-docs-codespan"><a href="#bar">SkyBar</a></code>.</p>',
    );

    const codeEls = getCodeElements();

    expect(codeEls.length).toBe(2);
    expect(codeEls[0]).toHaveText('foo');
    expect(codeEls[1].querySelector('a')).toHaveText('SkyBar');
    expect(getHostElement().querySelector('code.sky-docs-codespan')).toBeNull();
    expect(getHostElement().querySelector('p')).toHaveText(
      'Set foo to a SkyBar.',
    );
  });

  it('should replace the code components when the HTML changes', async () => {
    await render('<code class="sky-docs-codespan">foo</code>');
    await render(
      '<code class="sky-docs-codespan">bar</code> or <code class="sky-docs-codespan">baz</code>',
    );

    const codeEls = getCodeElements();

    expect(countDestroyedCodeRefs()).toBe(1);
    expect(codeEls.length).toBe(2);
    expect(codeEls[0]).toHaveText('bar');
    expect(codeEls[1]).toHaveText('baz');
  });

  it('should sanitize the HTML', async () => {
    await render(
      '<code class="sky-docs-codespan">foo</code><img src="x" onerror="alert(1)"><script>alert(2)</script>',
    );

    expect(getCodeElements()[0]).toHaveText('foo');
    expect(getHostElement().querySelector('script')).toBeNull();
    expect(getHostElement().querySelector('img')?.hasAttribute('onerror')).toBe(
      false,
    );
  });

  it('should destroy the code components when destroyed', async () => {
    await render(
      '<code class="sky-docs-codespan">foo</code> and <code class="sky-docs-codespan">bar</code>',
    );

    fixture.destroy();

    expect(countDestroyedCodeRefs()).toBe(2);
  });

  describe('a11y', () => {
    it('should be accessible when empty', async () => {
      await render('');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with inline code', async () => {
      await render('<p>Set <code class="sky-docs-codespan">foo</code>.</p>');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with a link in inline code', async () => {
      await render(
        '<p>Set <code class="sky-docs-codespan">foo</code> to a <code class="sky-docs-codespan"><a href="#bar">SkyBar</a></code>.</p>',
      );

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
