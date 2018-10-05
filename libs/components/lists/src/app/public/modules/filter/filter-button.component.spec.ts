import {
  TestBed,
  ComponentFixture,
  async
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  FilterButtonTestComponent
} from './fixtures/filter-button.component.fixture';

import {
  SkyFilterModule
} from '.';

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
        SkyFilterModule
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
    expect(getButtonEl().innerText.trim()).toBe('skyux_filter_button_title');
  }

  function verifyTextNotPresent() {
    expect(getButtonEl().innerText.trim()).not.toBe('skyux_filter_button_title');
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

  it('should be accessible', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
