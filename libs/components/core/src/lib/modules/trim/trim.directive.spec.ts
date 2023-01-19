import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';

import { SkyTrimTestComponent } from './fixtures/trim-test.component';
import { SkyTrimModule } from './trim.module';

describe('Trim directive', () => {
  let fixture: ComponentFixture<SkyTrimTestComponent>;
  let createSpy: jasmine.Spy<
    typeof SkyMutationObserverService.prototype.create
  >;

  // Wait for the next change detection cycle. This avoids having nested setTimeout() calls
  // and using the Jasmine done() function.
  function waitForMutationObserver() {
    return new Promise<void>((resolve) => {
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

    await waitForMutationObserver();
  });

  it('should trim white space in text nodes that are direct descendants on init', () => {
    const staticEl = fixture.nativeElement.querySelector('.static-text');
    expect(staticEl.textContent).toBe('Some static text');
  });

  it('should leave white space in text nodes that are not direct descendants on init', () => {
    const childEl = fixture.nativeElement.querySelector('.child-text');
    expect(childEl.textContent).toBe(' Child text ');
  });

  it('should trim white space when the content of a text node changes', async () => {
    const dynamicEl = fixture.nativeElement.querySelector('.dynamic-text');
    expect(dynamicEl.textContent).toBe('Some dynamic test');

    fixture.componentInstance.dynamicText = ' hello   ';
    fixture.detectChanges();

    await waitForMutationObserver();

    expect(dynamicEl.textContent).toBe('hello');
  });

  it('should disconnect the MutationObserver on destroy', () => {
    const disconnectSpies = createSpy.calls
      .all()
      .map((createSpyCall) =>
        spyOn(createSpyCall.returnValue, 'disconnect').and.callThrough()
      );

    fixture.destroy();

    for (const disconnectSpy of disconnectSpies) {
      expect(disconnectSpy).toHaveBeenCalledWith();
    }
  });
});
