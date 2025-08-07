import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppWindowRef } from '@skyux/core';

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
  } {
    const clipboardSpy = spyOn(
      TestBed.inject(SkyAppWindowRef).nativeWindow.navigator.clipboard,
      'writeText',
    );

    const clipboardSvc = TestBed.inject(SkyDocsClipboardService);
    const fixture = TestBed.createComponent(TestComponent);

    return { clipboardSpy, clipboardSvc, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });
  });

  it("should save an element's text content to the system clipboard", () => {
    const { clipboardSpy, clipboardSvc, fixture } = setupTest();

    fixture.detectChanges();

    clipboardSvc.copyTextContent(fixture.nativeElement, 'Copied');

    expect(clipboardSpy).toHaveBeenCalledWith('<h1>Hello, world!</h1>');
  });
});
