import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { VerticalTabsetBackToTopComponent } from './vertical-tabset-back-to-top.component';
import { VerticalTabsetBackToTopModule } from './vertical-tabset-back-to-top.module';

describe('Vertical tabset with a back to top', () => {
  function getBackToTopButton(): HTMLElement | null {
    return document.querySelector('.sky-back-to-top');
  }

  function getTabGroups(
    fixture: ComponentFixture<VerticalTabsetBackToTopComponent>
  ): HTMLElement[] {
    return fixture.nativeElement.querySelectorAll('.sky-vertical-tabset-group');
  }

  function getVisibleTabContentPane(
    fixture: ComponentFixture<VerticalTabsetBackToTopComponent>
  ): HTMLElement {
    return fixture.nativeElement.querySelector(
      '.sky-vertical-tab-content-pane:not(.sky-vertical-tab-hidden)'
    );
  }

  function clickTab(
    fixture: ComponentFixture<VerticalTabsetBackToTopComponent>,
    groupIndex: number,
    tabIndex: number
  ): void {
    const tab = getTabGroups(fixture)[groupIndex].querySelectorAll(
      '.sky-vertical-tab'
    )[tabIndex] as HTMLElement;
    tab.click();
    fixture.detectChanges();
  }

  function scrollTabContent(
    fixture: ComponentFixture<VerticalTabsetBackToTopComponent>
  ): void {
    const wrappingDiv = getVisibleTabContentPane(fixture)?.querySelector(
      'div'
    ) as HTMLElement | EventTarget;
    (wrappingDiv as HTMLElement)?.scrollTo({
      top: 1000,
    });
    SkyAppTestUtility.fireDomEvent(wrappingDiv, 'scroll');
  }

  let fixture: ComponentFixture<VerticalTabsetBackToTopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, VerticalTabsetBackToTopModule],
    });

    fixture = TestBed.createComponent(VerticalTabsetBackToTopComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Destroy the fixture to ensure all `ngOnDestroy` functions run to clear all back to top elements
    fixture.destroy();
    fixture.detectChanges();
  });

  it('should not show a back to top on initialization', () => {
    expect(getBackToTopButton()).toBeNull();
  });

  it('should show a back to top when the first tab is scrolled to the bottom', async () => {
    clickTab(fixture, 0, 0);
    fixture.detectChanges();
    await fixture.whenStable();

    scrollTabContent(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getBackToTopButton()).not.toBeNull();
  });

  it('should remove a back to top if one is visible and the tab changes', async () => {
    clickTab(fixture, 0, 0);
    fixture.detectChanges();
    await fixture.whenStable();

    scrollTabContent(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getBackToTopButton()).not.toBeNull();

    clickTab(fixture, 0, 1);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getBackToTopButton()).toBeNull();
  });

  it('should show a back to top after one is shown, the tab is changed, and the new tab is scrolled', async () => {
    clickTab(fixture, 0, 0);
    fixture.detectChanges();
    await fixture.whenStable();

    scrollTabContent(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getBackToTopButton()).not.toBeNull();

    clickTab(fixture, 0, 1);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    scrollTabContent(fixture);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getBackToTopButton()).not.toBeNull();
  });
});
