import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';

import { SkyTrimTestComponent } from './fixtures/trim-test.component';
import { SkyTrimModule } from './trim.module';

describe('Trim directive', () => {
  let fixture: ComponentFixture<SkyTrimTestComponent>;
  let createSpy: jasmine.Spy<
    typeof SkyMutationObserverService.prototype.create
  >;

  // Wait for the mutation observer to handle mutation.
  async function whenMutationObserverReady(): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve());
    });
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SkyTrimTestComponent],
      imports: [SkyTrimModule],
    });

    const mutationObsSvc = TestBed.inject(SkyMutationObserverService);
    createSpy = spyOn(mutationObsSvc, 'create').and.callThrough();

    fixture = TestBed.createComponent(SkyTrimTestComponent);
    fixture.detectChanges();

    await whenMutationObserverReady();
  });

  function validateTextContent(selector: string, expectedText: string): void {
    const el = fixture.nativeElement.querySelector(selector);
    expect(el.textContent).toBe(expectedText);
  }

  it('should trim white space in text nodes that are direct descendants on init', () => {
    validateTextContent('.static-text', 'Some static text');
  });

  it('should leave white space in text nodes that are not direct descendants on init', () => {
    validateTextContent('.child-text', ' Child text ');
  });

  it('should trim white space when the content of a text node changes', async () => {
    validateTextContent('.dynamic-text', 'Some dynamic test');

    fixture.componentRef.setInput('dynamicText', ' hello   ');
    fixture.detectChanges();

    await whenMutationObserverReady();

    validateTextContent('.dynamic-text', 'hello');
  });

  it('should preserve white space around text nodes that are not the first or last child node', async () => {
    validateTextContent('.inline-elements', 'First span 1 middle span 2 last');

    // Validate first text node changing
    fixture.componentRef.setInput('firstText', ' First 2');
    fixture.detectChanges();

    await whenMutationObserverReady();

    validateTextContent(
      '.inline-elements',
      'First 2 span 1 middle span 2 last',
    );

    // Validate last text node changing
    fixture.componentRef.setInput('lastText', 'last 2 ');
    fixture.detectChanges();

    await whenMutationObserverReady();

    validateTextContent(
      '.inline-elements',
      'First 2 span 1 middle span 2 last 2',
    );
  });

  it('should handle empty elements', () => {
    validateTextContent('.empty', '');
  });

  it('should disconnect the MutationObserver on destroy', () => {
    const disconnectSpies = createSpy.calls
      .all()
      .map((createSpyCall) =>
        spyOn(createSpyCall.returnValue, 'disconnect').and.callThrough(),
      );

    fixture.destroy();

    for (const disconnectSpy of disconnectSpies) {
      expect(disconnectSpy).toHaveBeenCalledWith();
    }
  });
});
