import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  expectAsync
} from '@skyux-sdk/testing';

import {
  SkyThemeModule,
  SkyThemeService
} from '@skyux/theme';

import {
  FilterButtonTestComponent
} from './fixtures/filter-button.component.fixture';

import {
  SkyFilterModule
} from './filter.module';

describe('Filter button', () => {
  let fixture: ComponentFixture<FilterButtonTestComponent>;
  let nativeElement: HTMLElement;
  let component: FilterButtonTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterButtonTestComponent
      ],
      imports: [
        SkyFilterModule,
        SkyThemeModule
      ],
      providers: [
        SkyThemeService
      ]
    });

    fixture = TestBed.createComponent(FilterButtonTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getButtonEl() {
    return nativeElement.querySelector('.sky-btn') as HTMLButtonElement;
  }

  function verifyTextPresent() {
    expect(getButtonEl().innerText.trim()).toBe('Filter');
  }

  function verifyTextNotPresent() {
    expect(getButtonEl().innerText.trim()).not.toBe('Filter');
  }

  it('should allow setting active state', () => {
    component.filtersActive = true;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.sky-btn')).toHaveCssClass('sky-filter-btn-active');
  });

  it('should allow setting id', () => {
    component.buttonId = 'i-am-an-id-look-at-me';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.sky-btn').id).toBe('i-am-an-id-look-at-me');
  });

  it('should allow setting aria labels', () => {
    component.ariaControls = 'filter-zone-2';
    component.ariaExpanded = true;
    fixture.detectChanges();

    let button = nativeElement.querySelector('.sky-btn');
    expect(button.getAttribute('aria-controls')).toBe('filter-zone-2');
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should emit event on click', () => {
    let buttonEl = getButtonEl();
    buttonEl.click();
    fixture.detectChanges();
    expect(component.buttonClicked).toBe(true);
  });

  it('should show button text', () => {
    fixture.detectChanges();
    verifyTextNotPresent();
    component.showButtonText = true;
    fixture.detectChanges();
    verifyTextPresent();
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should use modern icon when applicable', async () => {
    const defaultIcon = fixture.nativeElement.querySelector('sky-filter-button sky-icon i');
    expect(defaultIcon).toHaveCssClass('fa-filter');
    fixture.componentInstance.useModernTheme();
    fixture.detectChanges();
    const modernIcon = fixture.nativeElement.querySelector('sky-filter-button sky-icon i');
    expect(modernIcon).toHaveCssClass('sky-i-filter');
  });
});
