import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyChartCategoryAxisConfig } from '../shared/types/axis-types';

import {
  SKY_CHART_AXIS_REGISTRY,
  SkyChartAxisRegistry,
} from './chart-axis-registry.service';
import { SkyChartCategoryAxisComponent } from './chart-category-axis.component';

describe('SkyChartCategoryAxisComponent', () => {
  let fixture: ComponentFixture<SkyChartCategoryAxisComponent>;
  let mockRegistry: jasmine.SpyObj<SkyChartAxisRegistry>;

  beforeEach(() => {
    mockRegistry = jasmine.createSpyObj<SkyChartAxisRegistry>(
      'SkyChartAxisRegistry',
      [
        'upsertCategoryAxis',
        'removeCategoryAxis',
        'upsertMeasureAxis',
        'removeMeasureAxis',
      ],
      {
        categoryAxis: signal(undefined),
        measureAxis: signal(undefined),
      },
    );

    TestBed.configureTestingModule({
      imports: [SkyChartCategoryAxisComponent],
      providers: [
        {
          provide: SKY_CHART_AXIS_REGISTRY,
          useValue: mockRegistry,
        },
      ],
    });

    fixture = TestBed.createComponent(SkyChartCategoryAxisComponent);
  });

  describe('registration lifecycle', () => {
    it('should register the category axis with the registry on creation', () => {
      fixture.componentRef.setInput('labelText', 'Quarter');
      fixture.detectChanges();

      expect(mockRegistry.upsertCategoryAxis).toHaveBeenCalledWith({
        labelText: 'Quarter',
      } satisfies SkyChartCategoryAxisConfig);
    });

    it('should update the registry when labelText changes', () => {
      fixture.componentRef.setInput('labelText', 'Quarter');
      fixture.detectChanges();

      fixture.componentRef.setInput('labelText', 'Month');
      fixture.detectChanges();

      expect(mockRegistry.upsertCategoryAxis).toHaveBeenCalledWith({
        labelText: 'Month',
      } satisfies SkyChartCategoryAxisConfig);
    });

    it('should remove the category axis from the registry on destroy', () => {
      fixture.componentRef.setInput('labelText', 'Quarter');
      fixture.detectChanges();

      fixture.destroy();

      expect(mockRegistry.removeCategoryAxis).toHaveBeenCalled();
    });
  });

  describe('required inputs', () => {
    it('should require labelText', () => {
      expect(() => fixture.detectChanges()).toThrowError(
        /NG0950: Input is required/,
      );
    });
  });

  it('should reflect the label', () => {
    fixture.componentRef.setInput('labelText', 'Year');
    fixture.detectChanges();

    expect(mockRegistry.upsertCategoryAxis).toHaveBeenCalledWith({
      labelText: 'Year',
    } satisfies SkyChartCategoryAxisConfig);
  });

  it('should support tuple labelText', () => {
    fixture.componentRef.setInput('labelText', ['Label A', 'Label B']);
    fixture.detectChanges();

    expect(mockRegistry.upsertCategoryAxis).toHaveBeenCalledWith({
      labelText: ['Label A', 'Label B'],
    } satisfies SkyChartCategoryAxisConfig);
  });
});
