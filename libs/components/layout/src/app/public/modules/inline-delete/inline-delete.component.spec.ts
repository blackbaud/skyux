import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
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
  let fixture: ComponentFixture<InlineDeleteTestComponent>;
  let cmp: InlineDeleteTestComponent;
  let el: any;

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

  afterEach(fakeAsync(() => {
    cmp.showDelete = false;
    fixture.detectChanges();
    tick();
    fixture.destroy();
  }));

  it('should emit the deleteTriggered event when the delete button is clicked', fakeAsync(() => {
    fixture.detectChanges();
    const deleteTriggeredSpy = spyOn(cmp, 'onDeleteTriggered');
    fixture.nativeElement.querySelector('.sky-btn-danger').click();
    fixture.detectChanges();
    tick();
    expect(deleteTriggeredSpy).toHaveBeenCalled();
  }));

  it('should emit the cancelTriggered event when the cancel button is clicked', fakeAsync(() => {
    const cancelTriggeredSpy = spyOn(cmp, 'onCancelTriggered');
    fixture.detectChanges();
    tick();
    fixture.nativeElement.querySelector('.sky-btn-default').click();
    fixture.detectChanges();
    tick();
    expect(cancelTriggeredSpy).toHaveBeenCalled();
  }));

  it('should maintain css classes for card types correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();
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
  }));

  it('should show the sky wait when pending mode is on', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect((<HTMLElement>el.querySelector('.sky-wait-mask'))).toBeNull();
    cmp.pending = true;
    fixture.detectChanges();
    expect((<HTMLElement>el.querySelector('.sky-wait-mask'))).not.toBeNull();
  }));

  describe('focus handling', () => {
    it('should focus the delete button on load', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(document.activeElement).toBe(el.querySelector('.sky-btn-danger'));
      });
    }));

    it('should skip items that are under the overlay when tabbing forward', fakeAsync(() => {
      fixture.componentInstance.showExtraButtons = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      (<HTMLElement>el.querySelector('#noop-button-1')).focus();
      SkyAppTestUtility.fireDomEvent(el.querySelector('#covered-button'), 'focusin', {
        customEventInit: {
          relatedTarget: document.body
        }
      });
      fixture.detectChanges();
      expect(document.activeElement).toBe(el.querySelector('.sky-btn-danger'));
    }));

    it('should skip items that are under the overlay when tabbing backward', fakeAsync(() => {
      fixture.componentInstance.showExtraButtons = true;
      fixture.detectChanges();
      tick();
      (<HTMLElement>el.querySelector('.sky-btn-danger')).focus();
      SkyAppTestUtility.fireDomEvent(el.querySelector('#covered-button'), 'focusin', {
        customEventInit: {
          relatedTarget: el.querySelector('.sky-btn-danger')
        }
      });
      fixture.detectChanges();
      expect(document.activeElement).toBe(el.querySelector('#noop-button-1'));
    }));

    it('should wrap around to the next focusable item on the screen when no direct item is found and tabbing backwards',
      fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        (<HTMLElement>el.querySelector('.sky-btn-danger')).focus();
        SkyAppTestUtility.fireDomEvent(el.querySelector('#covered-button'), 'focusin', {
          customEventInit: {
            relatedTarget: el.querySelector('.sky-btn-danger')
          }
        });
        fixture.detectChanges();
        expect(document.activeElement).toBe(el.querySelector('.sky-inline-delete .sky-btn-default'));
      }));

    it('should leave focus on the parent if it is focused', fakeAsync(() => {
      fixture.componentInstance.parentTabIndex = 0;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      (<HTMLElement>el.querySelector('#inline-delete-fixture')).focus();
      SkyAppTestUtility.fireDomEvent(el.querySelector('#inline-delete-fixture'), 'focusin', {
        customEventInit: {
          relatedTarget: el.querySelector('.sky-btn-danger')
        }
      });
      fixture.detectChanges();
      expect(document.activeElement).toBe(el.querySelector('#inline-delete-fixture'));
    }));
  });

  describe('accessibility', () => {
    beforeEach(() => {
      cmp.showCoveredButtons = false;
    });

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
