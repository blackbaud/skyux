import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewkeeperTabsetComponent } from './viewkeeper-tabset.component';
import { ViewkeeperTabsetModule } from './viewkeeper-tabset.module';

describe('Tabset with viewkept elements', () => {
  function clickTabTriggerButton(): void {
    fixture.nativeElement.querySelector('#tabTriggerBtn').click();
    fixture.detectChanges();
  }

  function getTabset(): HTMLElement {
    return fixture.nativeElement.querySelector('sky-tabset');
  }

  function getTabs(): HTMLElement[] {
    return fixture.nativeElement.querySelectorAll(
      'sky-tab-button .sky-btn-tab'
    );
  }

  function getViewkeptElements(): HTMLElement[] {
    return fixture.nativeElement.querySelectorAll('.sky-viewkeeper-fixed');
  }

  let fixture: ComponentFixture<ViewkeeperTabsetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        ViewkeeperTabsetModule,
      ],
    });

    fixture = TestBed.createComponent(ViewkeeperTabsetComponent);
    fixture.detectChanges();
  });

  it('should render the tabset on load', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(getTabset()).not.toBeNull();

    const tabs = getTabs();
    expect(tabs.length).toBe(2);
    expect(tabs[0].classList.contains('sky-btn-tab-selected')).toBeTruthy();
    expect(tabs[1].classList.contains('sky-btn-tab-selected')).toBeFalsy();
  });

  it('should switch tabs correctly', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(getTabset()).not.toBeNull();

    const tabs = getTabs();
    expect(tabs.length).toBe(2);

    tabs[1].click();
    fixture.detectChanges();

    expect(tabs[0].classList.contains('sky-btn-tab-selected')).toBeFalsy();
    expect(tabs[1].classList.contains('sky-btn-tab-selected')).toBeTruthy();
  });

  it('should add the tab with the viewkept elements correctly', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    let tabs = getTabs();
    expect(tabs.length).toBe(2);

    clickTabTriggerButton();
    await fixture.whenStable();
    fixture.detectChanges();

    tabs = getTabs();
    expect(tabs.length).toBe(3);
    expect(tabs[0].classList.contains('sky-btn-tab-selected')).toBeTruthy();
    expect(tabs[1].classList.contains('sky-btn-tab-selected')).toBeFalsy();
    expect(tabs[2].classList.contains('sky-btn-tab-selected')).toBeFalsy();
  });

  it('should switch to the added tab correctly', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    clickTabTriggerButton();
    await fixture.whenStable();
    fixture.detectChanges();

    const tabs = getTabs();

    tabs[1].click();
    fixture.detectChanges();

    expect(tabs[0].classList.contains('sky-btn-tab-selected')).toBeFalsy();
    expect(tabs[1].classList.contains('sky-btn-tab-selected')).toBeTruthy();
    expect(tabs[2].classList.contains('sky-btn-tab-selected')).toBeFalsy();
  });

  it('should fix viewkeeper correctly when the page is scrolled', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    clickTabTriggerButton();
    await fixture.whenStable();
    fixture.detectChanges();

    const tabs = getTabs();

    tabs[1].click();
    fixture.detectChanges();

    window.scrollTo({
      top: 5000,
    });
    await fixture.whenStable();

    expect(getViewkeptElements().length).toBe(3);
  });
});
