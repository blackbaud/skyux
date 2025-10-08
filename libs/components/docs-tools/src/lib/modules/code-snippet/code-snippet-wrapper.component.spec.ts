import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SkyDocsCodeSnippetWrapperComponent } from './code-snippet-wrapper.component';

@Component({
  template: `
    <sky-docs-code-snippet
      [bordered]="bordered"
      [hideToolbar]="hideToolbar"
      [stacked]="stacked"
    >
      <code>const foo = 'bar';</code>
    </sky-docs-code-snippet>
  `,
  imports: [SkyDocsCodeSnippetWrapperComponent],
})
class TestComponent {
  public bordered = false;
  public hideToolbar = false;
  public stacked = false;
}

describe('SkyDocsCodeSnippetWrapperComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let nativeElement: HTMLElement;

  function setupTest(): void {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  }

  function getWrapperElement(): HTMLElement | null {
    return nativeElement.querySelector('sky-docs-code-snippet');
  }

  function getToolbar(): HTMLElement | null {
    return nativeElement.querySelector('sky-docs-code-snippet-toolbar');
  }

  function getPreElement(): HTMLPreElement | null {
    return nativeElement.querySelector('pre');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopAnimations()],
    });
  });

  it('should create the component', () => {
    setupTest();

    expect(getWrapperElement()).toBeTruthy();
  });

  it('should render the toolbar by default', () => {
    setupTest();

    expect(getToolbar()).toBeTruthy();
  });

  it('should hide the toolbar when hideToolbar is true', () => {
    setupTest();
    component.hideToolbar = true;
    fixture.detectChanges();

    expect(getToolbar()).toBeNull();
  });

  it('should render the code content in a pre element', () => {
    setupTest();

    const preElement = getPreElement();
    expect(preElement).toBeTruthy();
    expect(preElement?.textContent?.trim()).toBe("const foo = 'bar';");
  });

  it('should not apply bordered classes by default', () => {
    setupTest();

    const wrapperElement = getWrapperElement();
    expect(wrapperElement?.classList.contains('sky-elevation-0-bordered')).toBe(
      false,
    );
    expect(wrapperElement?.classList.contains('sky-padding-even-xl')).toBe(
      false,
    );
    expect(wrapperElement?.classList.contains('sky-rounded-corners')).toBe(
      false,
    );
  });

  it('should apply bordered classes when bordered is true', () => {
    setupTest();
    component.bordered = true;
    fixture.detectChanges();

    const wrapperElement = getWrapperElement();
    expect(wrapperElement?.classList.contains('sky-elevation-0-bordered')).toBe(
      true,
    );
    expect(wrapperElement?.classList.contains('sky-padding-even-xl')).toBe(
      true,
    );
    expect(wrapperElement?.classList.contains('sky-rounded-corners')).toBe(
      true,
    );
  });

  it('should not apply stacked class by default', () => {
    setupTest();

    const wrapperElement = getWrapperElement();
    expect(wrapperElement?.classList.contains('sky-margin-stacked-lg')).toBe(
      false,
    );
  });

  it('should apply stacked class when stacked is true', () => {
    setupTest();
    component.stacked = true;
    fixture.detectChanges();

    const wrapperElement = getWrapperElement();
    expect(wrapperElement?.classList.contains('sky-margin-stacked-lg')).toBe(
      true,
    );
  });

  it('should handle all inputs being true', () => {
    setupTest();
    component.bordered = true;
    component.hideToolbar = true;
    component.stacked = true;
    fixture.detectChanges();

    const wrapperElement = getWrapperElement();
    expect(wrapperElement?.classList.contains('sky-margin-stacked-lg')).toBe(
      true,
    );
    expect(wrapperElement?.classList.contains('sky-elevation-0-bordered')).toBe(
      true,
    );
    expect(wrapperElement?.classList.contains('sky-padding-even-xl')).toBe(
      true,
    );
    expect(wrapperElement?.classList.contains('sky-rounded-corners')).toBe(
      true,
    );
    expect(getToolbar()).toBeNull();
  });

  it('should transform boolean string attributes correctly', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()],
    });

    @Component({
      template: `
        <sky-docs-code-snippet bordered hideToolbar stacked>
          <code>test</code>
        </sky-docs-code-snippet>
      `,
      imports: [SkyDocsCodeSnippetWrapperComponent],
    })
    class TestStringAttributesComponent {}

    const stringAttrFixture = TestBed.createComponent(
      TestStringAttributesComponent,
    );
    stringAttrFixture.detectChanges();

    const wrapperElement = stringAttrFixture.nativeElement.querySelector(
      'sky-docs-code-snippet',
    );
    expect(wrapperElement?.classList.contains('sky-margin-stacked-lg')).toBe(
      true,
    );
    expect(wrapperElement?.classList.contains('sky-elevation-0-bordered')).toBe(
      true,
    );
    expect(
      stringAttrFixture.nativeElement.querySelector(
        'sky-docs-code-snippet-toolbar',
      ),
    ).toBeNull();
  });
});
