import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { DateFilterParams, IDateParams } from 'ag-grid-community';

import { SkyAgGridColumnFilterDatepickerComponent } from './column-filter-datepicker.component';

describe('SkyAgGridDatePickerComponent', () => {
  let component: SkyAgGridColumnFilterDatepickerComponent;
  let fixture: ComponentFixture<SkyAgGridColumnFilterDatepickerComponent>;

  function createMockParams(overrides?: Partial<IDateParams>): IDateParams {
    return {
      onDateChanged: jasmine.createSpy('onDateChanged'),
      onFocusIn: jasmine.createSpy('onFocusIn'),
      location: 'floatingFilter',
      filterParams: {},
      ...overrides,
    } as unknown as IDateParams;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyAgGridColumnFilterDatepickerComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyAgGridColumnFilterDatepickerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set params', () => {
      const params = createMockParams();
      component.agInit(params);
      expect(component.getDate()).toBeNull();
    });
  });

  describe('getDate', () => {
    it('should return null when no date is set', () => {
      expect(component.getDate()).toBeNull();
    });

    it('should return a Date when a date value is set', () => {
      const date = new Date('2019-01-01T00:00:00');
      component.setDate(date);
      const result = component.getDate();
      expect(result).toEqual(jasmine.any(Date));
      expect(result?.toISOString()).toBe(date.toISOString());
    });
  });

  describe('setDate', () => {
    it('should set the form control value from a Date', () => {
      const date = new Date('2019-06-15T00:00:00');
      component.setDate(date);
      expect(component.getDate()?.toISOString()).toBe(date.toISOString());
    });

    it('should clear the form control value when null is passed', () => {
      component.setDate(new Date('2019-06-15T00:00:00'));
      component.setDate(null);
      expect(component.getDate()).toBeNull();
    });
  });

  describe('setDisabled', () => {
    it('should disable the form control', () => {
      component.setDisabled(true);
      expect(component['formGroup'].controls.date.disabled).toBeTrue();
    });

    it('should enable the form control', () => {
      component.setDisabled(true);
      component.setDisabled(false);
      expect(component['formGroup'].controls.date.enabled).toBeTrue();
    });
  });

  describe('refresh', () => {
    it('should update params', () => {
      const params1 = createMockParams({ location: 'floatingFilter' });
      const params2 = createMockParams({ location: 'filter' });
      component.agInit(params1);
      component.refresh(params2);
      fixture.detectChanges();
      expect(component['isHeaderFiler']()).toBeTrue();
    });
  });

  describe('onDateChanged callback', () => {
    it('should call onDateChanged when the date value changes', () => {
      const params = createMockParams();
      component.agInit(params);
      component.setDate(new Date('2019-01-01T00:00:00'));
      expect(params.onDateChanged).toHaveBeenCalled();
    });
  });

  describe('isHeaderFilter', () => {
    it('should return true when location is filter', () => {
      const params = createMockParams({ location: 'filter' });
      component.agInit(params);
      fixture.detectChanges();
      expect(component['isHeaderFiler']()).toBeTrue();
    });

    it('should return false when location is not filter', () => {
      const params = createMockParams({ location: 'floatingFilter' });
      component.agInit(params);
      fixture.detectChanges();
      expect(component['isHeaderFiler']()).toBeFalse();
    });
  });

  describe('maxDate', () => {
    it('should return undefined when no maxValidDate is set', () => {
      const params = createMockParams({ filterParams: undefined });
      component.agInit(params);
      expect(component['maxDate']()).toBeUndefined();
    });

    it('should return the Date when maxValidDate is a Date', () => {
      const maxDate = new Date('2025-12-31');
      const params = createMockParams({
        filterParams: { maxValidDate: maxDate } as DateFilterParams,
      });
      component.agInit(params);
      expect(component['maxDate']()).toBe(maxDate);
    });

    it('should convert maxValidDate to a Date when it is a string', () => {
      const params = createMockParams({
        filterParams: { maxValidDate: '2025-12-31' } as DateFilterParams,
      });
      component.agInit(params);
      const result = component['maxDate']();
      expect(result).toEqual(jasmine.any(Date));
      expect(result?.toISOString()).toContain('2025-12-31');
    });
  });

  describe('minDate', () => {
    it('should return undefined when no minValidDate is set', () => {
      const params = createMockParams({ filterParams: {} as DateFilterParams });
      component.agInit(params);
      expect(component['minDate']()).toBeUndefined();
    });

    it('should return the Date when minValidDate is a Date', () => {
      const minDate = new Date('2019-01-01');
      const params = createMockParams({
        filterParams: { minValidDate: minDate } as DateFilterParams,
      });
      component.agInit(params);
      expect(component['minDate']()).toBe(minDate);
    });

    it('should convert minValidDate to a Date when it is a string', () => {
      const params = createMockParams({
        filterParams: { minValidDate: '2019-01-01' } as DateFilterParams,
      });
      component.agInit(params);
      const result = component['minDate']();
      expect(result).toEqual(jasmine.any(Date));
      expect(result?.toISOString()).toContain('2019-01-01');
    });
  });

  describe('focused', () => {
    it('should call onFocusIn when focused is called', () => {
      const params = createMockParams();
      component.agInit(params);
      component['focused']();
      expect(params.onFocusIn).toHaveBeenCalled();
    });
  });

  describe('openChange', () => {
    it('should call focused when the datepicker opens', () => {
      const params = createMockParams();
      component.agInit(params);
      component['openChange'](true);
      expect(params.onFocusIn).toHaveBeenCalled();
    });

    it('should not call focused when the datepicker closes', () => {
      const params = createMockParams();
      component.agInit(params);
      component['openChange'](false);
      expect(params.onFocusIn).not.toHaveBeenCalled();
    });
  });
});
