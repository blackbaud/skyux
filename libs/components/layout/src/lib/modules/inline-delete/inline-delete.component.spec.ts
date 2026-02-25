import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { SkyInlineDeleteFixturesModule } from './fixtures/inline-delete-fixtures.module';
import { InlineDeleteTestComponent } from './fixtures/inline-delete.component.fixture';
import { SkyInlineDeleteType } from './inline-delete-type';

describe('Inline delete component', () => {
  let fixture: ComponentFixture<InlineDeleteTestComponent>;
  let cmp: InlineDeleteTestComponent;
  let el: any;

  function dispatchTransitionEnd(): void {
    const container = el.querySelector(
      '.sky-inline-delete-content-animation-container',
    );
    container?.dispatchEvent(
      new TransitionEvent('transitionend', { propertyName: 'transform' }),
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyInlineDeleteFixturesModule],
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
    dispatchTransitionEnd();
    tick();
    expect(cancelTriggeredSpy).toHaveBeenCalled();
  }));

  it('should ignore non-transform transition events', fakeAsync(() => {
    const cancelTriggeredSpy = spyOn(cmp, 'onCancelTriggered');
    fixture.detectChanges();
    tick();
    const container = el.querySelector(
      '.sky-inline-delete-content-animation-container',
    );
    container?.dispatchEvent(
      new TransitionEvent('transitionend', { propertyName: 'opacity' }),
    );
    fixture.detectChanges();
    tick();
    expect(cancelTriggeredSpy).not.toHaveBeenCalled();
  }));

  it('should maintain css classes for card types correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(
      (
        el.querySelector('.sky-inline-delete') as HTMLElement
      ).classList.contains('sky-inline-delete-standard'),
    ).toBeTruthy();
    expect(
      (
        el.querySelector('.sky-inline-delete') as HTMLElement
      ).classList.contains('sky-inline-delete-card'),
    ).toBeFalsy();
    cmp.inlineDelete.setType(SkyInlineDeleteType.Card);
    fixture.detectChanges();
    expect(
      (
        el.querySelector('.sky-inline-delete') as HTMLElement
      ).classList.contains('sky-inline-delete-standard'),
    ).toBeFalsy();
    expect(
      (
        el.querySelector('.sky-inline-delete') as HTMLElement
      ).classList.contains('sky-inline-delete-card'),
    ).toBeTruthy();
  }));

  it('should show the sky wait when pending mode is on', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(el.querySelector('.sky-wait-mask') as HTMLElement).toBeNull();
    cmp.pending = true;
    fixture.detectChanges();
    expect(el.querySelector('.sky-wait-mask') as HTMLElement).not.toBeNull();
    cmp.pending = undefined;
    fixture.detectChanges();
    tick();
    expect(el.querySelector('.sky-wait-mask') as HTMLElement).toBeNull();
  }));

  describe('focus handling', () => {
    it('should focus the delete button on load', async () => {
      fixture.detectChanges();
      dispatchTransitionEnd();
      await fixture.whenStable();
      expect(document.activeElement).toBe(el.querySelector('.sky-btn-danger'));
    });

    it('should skip items that are under the overlay when tabbing forward', fakeAsync(() => {
      fixture.componentInstance.showExtraButtons = true;
      fixture.detectChanges();
      dispatchTransitionEnd();
      tick();
      fixture.detectChanges();
      el.querySelector('#noop-button-1').focus();
      SkyAppTestUtility.fireDomEvent(
        el.querySelector('#covered-button'),
        'focusin',
        {
          customEventInit: {
            relatedTarget: document.body,
          },
        },
      );
      fixture.detectChanges();
      expect(document.activeElement).toBe(el.querySelector('.sky-btn-danger'));
    }));

    it('should skip items that are under the overlay when tabbing backward', fakeAsync(() => {
      fixture.componentInstance.showExtraButtons = true;
      fixture.detectChanges();
      dispatchTransitionEnd();
      tick();
      el.querySelector('.sky-btn-danger').focus();
      SkyAppTestUtility.fireDomEvent(
        el.querySelector('#covered-button'),
        'focusin',
        {
          customEventInit: {
            relatedTarget: el.querySelector('.sky-btn-danger'),
          },
        },
      );
      fixture.detectChanges();
      expect(document.activeElement).toBe(el.querySelector('#noop-button-1'));
    }));

    it('should wrap around to the next focusable item on the screen when no direct item is found and tabbing backwards', fakeAsync(() => {
      fixture.detectChanges();
      dispatchTransitionEnd();
      tick();
      fixture.detectChanges();
      el.querySelector('.sky-btn-danger').focus();
      SkyAppTestUtility.fireDomEvent(
        el.querySelector('#covered-button'),
        'focusin',
        {
          customEventInit: {
            relatedTarget: el.querySelector('.sky-btn-danger'),
          },
        },
      );
      fixture.detectChanges();
      expect(document.activeElement).toBe(
        el.querySelector('.sky-inline-delete .sky-btn-default'),
      );
    }));

    it('should leave focus on the parent if it is focused', fakeAsync(() => {
      fixture.componentInstance.parentTabIndex = 0;
      fixture.detectChanges();
      dispatchTransitionEnd();
      tick();
      fixture.detectChanges();
      el.querySelector('#inline-delete-fixture').focus();
      SkyAppTestUtility.fireDomEvent(
        el.querySelector('#inline-delete-fixture'),
        'focusin',
        {
          customEventInit: {
            relatedTarget: el.querySelector('.sky-btn-danger'),
          },
        },
      );
      fixture.detectChanges();
      expect(document.activeElement).toBe(
        el.querySelector('#inline-delete-fixture'),
      );
    }));
  });

  describe('accessibility', () => {
    beforeEach(() => {
      cmp.showCoveredButtons = false;
    });

    it('should be accessible in standard mode', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible in card mode', async () => {
      fixture.detectChanges();
      cmp.inlineDelete.setType(SkyInlineDeleteType.Card);
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when pending', async () => {
      cmp.pending = true;
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
