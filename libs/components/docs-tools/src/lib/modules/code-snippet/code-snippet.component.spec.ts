import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { type HighlightOptions, type HighlightResult } from 'highlight.js';
import highlight from 'highlight.js/lib/core';
import hlJavaScript from 'highlight.js/lib/languages/javascript';
import hlScss from 'highlight.js/lib/languages/scss';
import hlTypeScript from 'highlight.js/lib/languages/typescript';
import hlXml from 'highlight.js/lib/languages/xml';

import { SkyClipboardService } from '../clipboard/clipboard.service';

import { SkyCodeSnippetComponent } from './code-snippet.component';
import { SkyCodeSnippetModule } from './code-snippet.module';

describe('code-snippet.component', () => {
  function setupTest(): { fixture: ComponentFixture<SkyCodeSnippetComponent> } {
    const fixture = TestBed.createComponent(SkyCodeSnippetComponent);

    return { fixture };
  }

  function getPreElement(
    fixture: ComponentFixture<SkyCodeSnippetComponent>,
  ): HTMLPreElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector<HTMLPreElement>(
      '.sky-code-snippet-pre',
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyCodeSnippetModule],
    });
  });

  it('should render a code snippet', () => {
    const { fixture } = setupTest();

    const highlightSpy = spyOn(
      highlight,
      'highlight',
    ).and.callThrough() as jasmine.Spy<{
      (code: string, options: HighlightOptions): HighlightResult;
    }>;

    const code = String.raw`
<div
  class="foo"
  [attr.title]="'Hello'"
  (click)="onClick($event)"
>
  @if (true) {
    <p>Hello, world.</p>
  }
</div>
`;

    fixture.componentRef.setInput('code', code);
    fixture.componentRef.setInput('language', 'ts');
    fixture.detectChanges();

    expect(getPreElement(fixture)?.textContent).toEqual(code);

    expect(highlightSpy).toHaveBeenCalledWith(code, { language: 'ts' });
  });

  it('should register languages with highlight.js', () => {
    const registerSpy = spyOn(highlight, 'registerLanguage').and.callThrough();

    const { fixture } = setupTest();

    fixture.componentRef.setInput('code', `const foo = 'bar';`);
    fixture.componentRef.setInput('language', 'ts');
    fixture.detectChanges();

    expect(registerSpy).toHaveBeenCalledTimes(4);
    expect(registerSpy).toHaveBeenCalledWith('html', hlXml);
    expect(registerSpy).toHaveBeenCalledWith('js', hlJavaScript);
    expect(registerSpy).toHaveBeenCalledWith('scss', hlScss);
    expect(registerSpy).toHaveBeenCalledWith('ts', hlTypeScript);
  });

  it('should copy snippet to clipboard', () => {
    const { fixture } = setupTest();

    const clipboardSpy = spyOn(
      TestBed.inject(SkyClipboardService),
      'copyTextContent',
    );

    fixture.componentRef.setInput('code', `const foo = 'bar';`);
    fixture.componentRef.setInput('language', 'ts');
    fixture.detectChanges();

    const button = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLButtonElement>('button.sky-btn');

    button?.click();
    fixture.detectChanges();

    expect(clipboardSpy).toHaveBeenCalledWith(
      jasmine.any(ElementRef),
      'Code copied',
    );
  });
});
