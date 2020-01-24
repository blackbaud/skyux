import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  InlineDeleteTestComponent
} from './fixtures/inline-delete.component.fixture';

import {
  SkyInlineDeleteFixturesModule
} from './fixtures/inline-delete-fixtures.module';

import {
  SkyInlineDeleteType
} from './inline-delete-type';

describe('Inline delete component', () => {
  const ANIMATION_TIMEOUT: number = 401;
  let fixture: ComponentFixture<InlineDeleteTestComponent>;
  let cmp: InlineDeleteTestComponent;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyInlineDeleteFixturesModule
      ]
    });

    fixture = TestBed.createComponent(InlineDeleteTestComponent);
    cmp = fixture.componentInstance;
    el = fixture.nativeElement;
  });

  it('should emit the deleteTriggered event when the delete button is clicked', () => {
    fixture.detectChanges();
    const deleteTriggeredSpy = spyOn(cmp.inlineDelete.deleteTriggered, 'emit').and.callThrough();
    (<HTMLElement>el.querySelector('.sky-btn-danger')).click();
    fixture.detectChanges();
    expect(deleteTriggeredSpy).toHaveBeenCalled();
  });

  it('should emit the cancelTriggered event when the cancel button is clicked', async(() => {
    fixture.detectChanges();
    const cancelTriggeredSpy = spyOn(cmp.inlineDelete.cancelTriggered, 'emit').and.callThrough();
    (<HTMLElement>el.querySelector('.sky-btn-default')).click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      setTimeout(() => {
        expect(cancelTriggeredSpy).toHaveBeenCalled();
      }, ANIMATION_TIMEOUT);
    });
  }));

  it('should maintain css classes for card types correctly', () => {
    fixture.detectChanges();
    expect((<HTMLElement>el.querySelector('.sky-inline-delete'))
      .classList.contains('sky-inline-delete-standard')).toBeTruthy();
    expect((<HTMLElement>el.querySelector('.sky-inline-delete'))
      .classList.contains('sky-inline-delete-card')).toBeFalsy();
    cmp.inlineDelete.setType(SkyInlineDeleteType.Card);
    fixture.detectChanges();
    expect((<HTMLElement>el.querySelector('.sky-inline-delete'))
      .classList.contains('sky-inline-delete-standard')).toBeFalsy();
    expect((<HTMLElement>el.querySelector('.sky-inline-delete'))
      .classList.contains('sky-inline-delete-card')).toBeTruthy();
  });

  it('should show the sky wait when pending mode is on', () => {
    fixture.detectChanges();
    expect((<HTMLElement>el.querySelector('.sky-wait-mask'))).toBeNull();
    cmp.pending = true;
    fixture.detectChanges();
    expect((<HTMLElement>el.querySelector('.sky-wait-mask'))).not.toBeNull();
  });

  describe('focus handling', () => {
    it('should focus the delete button on load', async(() => {
      fixture.detectChanges();
      setTimeout(() => {
        expect(document.activeElement).toBe(el.querySelector('.sky-btn-danger'));
      }, ANIMATION_TIMEOUT);
    }));

    it('should skip items that are under the overlay when tabbing forward', async(() => {
      fixture.componentInstance.showExtraButtons = true;
      fixture.detectChanges();
      (<HTMLElement>el.querySelector('#noop-button-1')).focus();
      setTimeout(() => {
        SkyAppTestUtility.fireDomEvent(el.querySelector('#covered-button'), 'focusin', {
          customEventInit: {
            relatedTarget: document.body
          }
        });
        fixture.detectChanges();
        expect(document.activeElement).toBe(el.querySelector('.sky-btn-danger'));
      }, ANIMATION_TIMEOUT);
    }));

    it('should skip items that are under the overlay when tabbing backward', async(() => {
      fixture.componentInstance.showExtraButtons = true;
      fixture.detectChanges();
      (<HTMLElement>el.querySelector('.sky-btn-danger')).focus();
      setTimeout(() => {
        SkyAppTestUtility.fireDomEvent(el.querySelector('#covered-button'), 'focusin', {
          customEventInit: {
            relatedTarget: el.querySelector('.sky-btn-danger')
          }
        });
        fixture.detectChanges();
        expect(document.activeElement).toBe(el.querySelector('#noop-button-1'));
      }, ANIMATION_TIMEOUT);
    }));

    it('should wrap around to the next focusable item on the screen when no direct item is found and tabbing backwards',
      async(() => {
        fixture.detectChanges();
        (<HTMLElement>el.querySelector('.sky-btn-danger')).focus();
        setTimeout(() => {
          SkyAppTestUtility.fireDomEvent(el.querySelector('#covered-button'), 'focusin', {
            customEventInit: {
              relatedTarget: el.querySelector('.sky-btn-danger')
            }
          });
          fixture.detectChanges();
          expect(document.activeElement).toBe(el.querySelector('.sky-inline-delete .sky-btn-default'));
        }, ANIMATION_TIMEOUT);
      }));
  });

  describe('accessibility', () => {
    it('should be accessible in standard mode', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible in card mode', async(() => {
      fixture.detectChanges();
      cmp.inlineDelete.setType(SkyInlineDeleteType.Card);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible when pending', async(() => {
      cmp.pending = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // NOTE: For some reason the color contrast rule fails on IE and Edge but passes all other
        // browsers. A manual test was done and nothing is different in these browsers so I am just
        // disabling the color contrast rule for this test for now.
        expect(fixture.nativeElement)
          .toBeAccessible(() => { }, { rules: { 'color-contrast': { enabled: false } } });
      });
    }));
  });
});
