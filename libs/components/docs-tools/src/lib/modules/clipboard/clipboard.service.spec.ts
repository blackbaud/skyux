import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyToastService } from '@skyux/toast';

import { SkyDocsClipboardService } from './clipboard.service';

@Component({
  selector: 'app-test',
  template: `
    @if (true) {
      <div class="foo">&lt;h1>Hello, world!&lt;/h1></div>
    }
  `,
})
class TestComponent {}

describe('clipboard.service', () => {
  function setupTest(): {
    clipboardSpy: jasmine.Spy<jasmine.Func>;
    clipboardSvc: SkyDocsClipboardService;
    fixture: ComponentFixture<TestComponent>;
    toastSpy: jasmine.Spy;
  } {
    const clipboardSpy = spyOn(
      TestBed.inject(SkyAppWindowRef).nativeWindow.navigator.clipboard,
      'writeText',
    );

    const toastSpy = spyOn(TestBed.inject(SkyToastService), 'openMessage');

    const clipboardSvc = TestBed.inject(SkyDocsClipboardService);
    const fixture = TestBed.createComponent(TestComponent);

    return { clipboardSpy, clipboardSvc, fixture, toastSpy };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });
  });

  it("should save an element's text content to the system clipboard", () => {
    const { clipboardSpy, clipboardSvc, fixture, toastSpy } = setupTest();

    fixture.detectChanges();

    clipboardSvc.copyTextContent(fixture.nativeElement, 'Copied');

    expect(clipboardSpy).toHaveBeenCalledWith('<h1>Hello, world!</h1>');
    expect(toastSpy).toHaveBeenCalledWith('Copied', { autoClose: true });
  });

  it('should handle nullish textContent by copying an empty string', () => {
    const { clipboardSpy, clipboardSvc, toastSpy } = setupTest();

    const mockElement = document.createElement('div');
    Object.defineProperty(mockElement, 'textContent', {
      get: () => null,
      configurable: true,
    });

    clipboardSvc.copyTextContent(mockElement, 'Success');

    expect(clipboardSpy).toHaveBeenCalledWith('');
    expect(toastSpy).toHaveBeenCalledWith('Success', { autoClose: true });
  });
});
