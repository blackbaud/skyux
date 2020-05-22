import {
  ComponentFixture,
  TestBed,
  async
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyClipboardModule,
  SkyCopyToClipboardService
} from '@blackbaud/skyux-lib-clipboard';

import {
  SkyCodeBlockTestComponent
} from './fixtures/code-block.component.fixture';

import {
  SkyCodeBlockComponent
} from './code-block.component';

import {
  SkyCodeBlockResourcesModule
} from '../shared/code-block-resources.module';

class MockClipboardService {
  public copyContent() { }
}

describe('SkyCodeBlockComponent', () => {
  let component: SkyCodeBlockComponent;
  let fixture: ComponentFixture<SkyCodeBlockComponent>;
  let element: HTMLElement;
  let mockClipboardService: any;

  beforeEach(() => {
    mockClipboardService = new MockClipboardService();

    TestBed.configureTestingModule({
      declarations: [
        SkyCodeBlockTestComponent,
        SkyCodeBlockComponent
      ],
      providers: [
        { provide: SkyCopyToClipboardService, useValue: mockClipboardService }
      ],
      imports: [
        SkyClipboardModule,
        SkyCodeBlockResourcesModule
      ]
    });

    fixture = TestBed.createComponent(SkyCodeBlockComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should accept a string of code in the [code] attribute', () => {
    const code = '<p>asdf</p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')).toHaveText(code);
  });

  it('should not honor angular bindings in the [code] attribute', () => {
    const code = '<p>{{asdf}}</p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-output')).toHaveText(code);
  });

  it('should convert inner HTML to a string', () => {
    const code = '<p>Hello, {{name}}!</p>';
    const testFixture = TestBed.createComponent(SkyCodeBlockTestComponent);
    const testElement = testFixture.nativeElement;
    testFixture.detectChanges();
    expect(testElement.querySelector('.sky-code-output').textContent).toContain(code);
  });

  it('should not honor angular bindings in the inner HTML', () => {
    const code = '<p>Hello, {{name}}!</p>';
    const testFixture = TestBed.createComponent(SkyCodeBlockTestComponent);
    const testElement = testFixture.nativeElement;
    testFixture.detectChanges();
    expect(testElement.querySelector('.sky-code-output').textContent).toContain(code);
  });

  it('should handle invalid language types', () => {
    const code = '<p></p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();

    component.languageType = 'invalidType';
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();

    component.languageType = 'javascript';
    fixture.detectChanges();
    expect(element.querySelector('code.language-javascript')).toExist();

    component.languageType = undefined;
    fixture.detectChanges();
    expect(element.querySelector('code.language-markup')).toExist();
  });

  it('should show copy to clipboard button', () => {
    const code = '<p></p>';
    component.code = code;
    fixture.detectChanges();
    expect(element.querySelector('sky-copy-to-clipboard')).toExist();
  });

  it('should hide copy to clipboard button', () => {
    const code = '<p></p>';
    component.code = code;
    component.hideCopyToClipboard = true;
    fixture.detectChanges();
    expect(element.querySelector('sky-copy-to-clipboard')).not.toExist();
  });

  it('should show the header if languageType is defined', () => {
    const code = '<p></p>';
    component.code = code;
    component.languageType = 'csharp';
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).toExist();
  });

  it('should show the header if copyToClipboard is shown', () => {
    const code = '<p></p>';
    component.code = code;
    component.hideCopyToClipboard = false;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).toExist();
  });

  it('should hide the header if hideHeader is true', () => {
    const code = '<p></p>';
    component.code = code;
    component.hideHeader = true;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).not.toExist();
  });

  it('should hide the header if copyToClipboard is false, and languageType and fileName are undefined', () => {
    const code = '<p></p>';
    component.code = code;
    component.hideCopyToClipboard = true;
    component.languageType = undefined;
    component.fileName = undefined;
    fixture.detectChanges();
    expect(element.querySelector('.sky-code-block-header')).not.toExist();
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    expect(element).toBeAccessible();
  }));
});
