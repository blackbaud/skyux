import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import { SkyDropdownMessageType } from '@skyux/popovers';

import { SkySummaryActionBarTestComponent } from '../fixtures/summary-action-bar.component.fixture';
import { SkySummaryActionBarFixtureModule } from '../fixtures/summary-action-bar.module.fixture';

describe('Summary Action Bar action components', () => {
  let fixture: ComponentFixture<SkySummaryActionBarTestComponent>;
  let cmp: SkySummaryActionBarTestComponent;
  let debugElement: DebugElement;
  let mediaQueryController: SkyMediaQueryTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkySummaryActionBarFixtureModule],
      providers: [provideSkyMediaQueryTesting()],
    });

    fixture = TestBed.createComponent(SkySummaryActionBarTestComponent);
    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    cmp = fixture.componentInstance as SkySummaryActionBarTestComponent;
    debugElement = fixture.debugElement;
  });

  describe('click event', () => {
    it('should emit the actionClick event when the primary action button is clicked', () => {
      spyOn(cmp, 'clickHandler').and.stub();
      fixture.detectChanges();
      debugElement
        .query(By.css('sky-summary-action-bar-primary-action button'))
        .nativeElement.click();
      fixture.detectChanges();
      expect(cmp.clickHandler).toHaveBeenCalled();
    });

    it('should emit the actionClick event when the secondary action button is clicked', () => {
      spyOn(cmp, 'clickHandler').and.stub();
      fixture.detectChanges();
      debugElement
        .query(By.css('sky-summary-action-bar-secondary-action button'))
        .nativeElement.click();
      fixture.detectChanges();
      expect(cmp.clickHandler).toHaveBeenCalled();
    });

    it('should emit the actionClick event when the cancel button is clicked', () => {
      spyOn(cmp, 'clickHandler').and.stub();
      fixture.detectChanges();
      debugElement
        .query(By.css('sky-summary-action-bar-cancel button'))
        .nativeElement.click();
      fixture.detectChanges();
      expect(cmp.clickHandler).toHaveBeenCalled();
    });
  });

  describe('disabled states', () => {
    it('should disable the element when the primary action button has disabled set to true', () => {
      cmp.disableButtons = true;
      fixture.detectChanges();
      expect(
        debugElement.query(
          By.css('sky-summary-action-bar-primary-action button'),
        ).nativeElement.disabled,
      ).toBeTruthy();
    });

    it('should disable the element when the secondary action button has disabled set to true', () => {
      cmp.disableButtons = true;
      fixture.detectChanges();
      expect(
        debugElement.query(
          By.css('sky-summary-action-bar-secondary-action button'),
        ).nativeElement.disabled,
      ).toBeTruthy();
    });

    it('should disable the element when the cancel button has disabled set to true', () => {
      cmp.disableButtons = true;
      fixture.detectChanges();
      expect(
        debugElement.query(By.css('sky-summary-action-bar-cancel button'))
          .nativeElement.disabled,
      ).toBeTruthy();
    });
  });

  describe('secondary actions', () => {
    it('should have secondary actions with isDropdown as false on large screens', () => {
      fixture.detectChanges();

      expect(
        cmp.secondaryActions?.secondaryActionComponents()?.length,
      ).toBeTruthy();
      cmp.secondaryActions?.secondaryActionComponents()?.forEach((action) => {
        expect(action.isDropdown).toBeFalsy();
      });
    });

    it('should have secondary actions with isDropdown as false on large screens when there are five actions', () => {
      fixture.detectChanges();

      expect(
        cmp.secondaryActions?.secondaryActionComponents()?.length,
      ).toBeTruthy();
      cmp.secondaryActions?.secondaryActionComponents()?.forEach((action) => {
        expect(action.isDropdown).toBeFalsy();
      });

      fixture.detectChanges();
      cmp.extraActions = true;
      fixture.detectChanges();

      expect(
        cmp.secondaryActions?.secondaryActionComponents()?.length,
      ).toBeTruthy();
      cmp.secondaryActions?.secondaryActionComponents()?.forEach((action) => {
        expect(action.isDropdown).toBeTruthy();
      });
    });

    it('should have secondary actions with isDropdown as true on xs screens', () => {
      mediaQueryController.setBreakpoint('xs');
      fixture.detectChanges();

      expect(
        cmp.secondaryActions?.secondaryActionComponents()?.length,
      ).toBeTruthy();
      cmp.secondaryActions?.secondaryActionComponents()?.forEach((action) => {
        expect(action.isDropdown).toBeTruthy();
      });
    });

    it('should dismiss dropdown menu when the secondary action button is clicked', fakeAsync(() => {
      mediaQueryController.setBreakpoint('xs');
      cmp.extraActions = true;
      fixture.detectChanges();
      tick();
      let root: HTMLElement = fixture.nativeElement;
      while (root.parentElement) {
        root = root.parentElement;
      }
      expect(
        root.querySelector(
          'sky-dropdown-menu sky-summary-action-bar-secondary-action button',
        ),
      ).toBeFalsy();
      cmp.secondaryActions?.dropdownMessageStream.next({
        type: SkyDropdownMessageType.Open,
      });
      fixture.detectChanges();
      tick();
      expect(
        root.querySelector(
          'sky-dropdown-menu sky-summary-action-bar-secondary-action button',
        ),
      ).toBeTruthy();
      cmp.secondaryActions?.secondaryActionComponents()?.[0].actionClick.emit();
      fixture.detectChanges();
      tick();
      expect(
        root.querySelector(
          'sky-dropdown-menu sky-summary-action-bar-secondary-action button',
        ),
      ).toBeFalsy();
    }));
  });

  describe('a11y', () => {
    it('should be accessible (standard lg setup)', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (standard xs setup)', async () => {
      fixture.detectChanges();
      mediaQueryController.setBreakpoint('xs');
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (standard xs setup collapsed summary)', async () => {
      fixture.detectChanges();
      mediaQueryController.setBreakpoint('xs');
      fixture.detectChanges();
      await fixture.whenStable();
      debugElement
        .query(By.css('.sky-summary-action-bar-details-collapse button'))
        .nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
