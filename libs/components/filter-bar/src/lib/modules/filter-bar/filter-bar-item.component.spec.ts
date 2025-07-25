import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { of } from 'rxjs';

import { SkyFilterBarItemComponent } from './filter-bar-item.component';
import { SkyFilterBarFilterModalConfig } from './models/filter-bar-filter-modal-config';
import { SkyFilterBarFilterValue } from './models/filter-bar-filter-value';

describe('Filter bar item component', () => {
  let component: SkyFilterBarItemComponent;
  let componentRef: ComponentRef<SkyFilterBarItemComponent>;
  let fixture: ComponentFixture<SkyFilterBarItemComponent>;
  let modalServiceSpy: jasmine.SpyObj<SkyModalService>;

  beforeEach(async () => {
    modalServiceSpy = jasmine.createSpyObj('SkyModalService', ['open']);

    await TestBed.configureTestingModule({
      imports: [SkyFilterBarItemComponent],
      providers: [{ provide: SkyModalService, useValue: modalServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarItemComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('filterId', 'test id');
    componentRef.setInput('filterName', 'test filter');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal and set filter value on save', () => {
    const config: SkyFilterBarFilterModalConfig = {
      modalComponent: class {},
      modalSize: 'medium',
    };
    const closed$ = of({ reason: 'save', data: { value: 'new' } });
    modalServiceSpy.open.and.returnValue({
      closed: closed$,
    } as SkyModalInstance);

    componentRef.setInput('filterModalConfig', config);
    component.openFilterModal();

    expect(modalServiceSpy.open).toHaveBeenCalled();
    expect(component.filterValue()).toEqual({ value: 'new' });
  });

  it('should open a full screen modal', () => {
    const modalComponent = class {};
    const config: SkyFilterBarFilterModalConfig = {
      modalComponent: modalComponent,
      modalSize: 'full',
    };
    const closed$ = of({ reason: 'save', data: { value: 'new' } });
    modalServiceSpy.open.and.returnValue({
      closed: closed$,
    } as SkyModalInstance);

    componentRef.setInput('filterModalConfig', config);
    component.openFilterModal();

    expect(modalServiceSpy.open).toHaveBeenCalledWith(
      modalComponent,
      jasmine.objectContaining({ fullPage: true }),
    );
    expect(component.filterValue()).toEqual({ value: 'new' });
  });

  it('should not set filter value if modal is closed for other reasons', () => {
    const config: SkyFilterBarFilterModalConfig = {
      modalComponent: class {},
      modalSize: 'medium',
    };
    const closed$ = of({ reason: 'cancel' });
    modalServiceSpy.open.and.returnValue({
      closed: closed$,
    } as SkyModalInstance);

    componentRef.setInput('filterModalConfig', config);
    component.filterValue.set({ value: 'old' } as SkyFilterBarFilterValue);
    component.openFilterModal();

    expect(component.filterValue()).toEqual({ value: 'old' });
  });

  it('should not open modal if config is not set', () => {
    componentRef.setInput('filterModalConfig', undefined);
    component.openFilterModal();
    expect(modalServiceSpy.open).not.toHaveBeenCalled();
  });
});
