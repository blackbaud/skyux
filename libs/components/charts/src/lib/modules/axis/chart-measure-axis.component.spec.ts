import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyChartMeasureAxisConfig } from '../shared/types/axis-types';

import {
  SKY_CHART_AXIS_REGISTRY,
  SkyChartAxisRegistry,
} from './chart-axis-registry.service';
import { SkyChartMeasureAxisComponent } from './chart-measure-axis.component';

describe('SkyChartMeasureAxisComponent', () => {
  let fixture: ComponentFixture<SkyChartMeasureAxisComponent>;
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
      imports: [SkyChartMeasureAxisComponent],
      providers: [
        {
          provide: SKY_CHART_AXIS_REGISTRY,
          useValue: mockRegistry,
        },
      ],
    });

    fixture = TestBed.createComponent(SkyChartMeasureAxisComponent);
  });

  describe('registration lifecycle', () => {
    it('should register the measure axis with the registry on creation', () => {
      fixture.componentRef.setInput('labelText', 'Revenue');
      fixture.detectChanges();

      expect(mockRegistry.upsertMeasureAxis).toHaveBeenCalledWith(
        jasmine.objectContaining<SkyChartMeasureAxisConfig>({
          labelText: 'Revenue',
          scaleType: 'linear',
        }),
      );
    });

    it('should update the registry when any input changes', () => {
      fixture.componentRef.setInput('labelText', 'Revenue');
      fixture.detectChanges();

      fixture.componentRef.setInput('labelText', 'Cost');
      fixture.detectChanges();

      expect(mockRegistry.upsertMeasureAxis).toHaveBeenCalledWith(
        jasmine.objectContaining<SkyChartMeasureAxisConfig>({
          labelText: 'Cost',
        }),
      );
    });

    it('should remove the measure axis from the registry on destroy', () => {
      fixture.componentRef.setInput('labelText', 'Revenue');
      fixture.detectChanges();

      fixture.destroy();

      expect(mockRegistry.removeMeasureAxis).toHaveBeenCalled();
    });
  });

  describe('required inputs', () => {
    it('should require labelText', () => {
      expect(() => fixture.detectChanges()).toThrowError(
        /NG0950: Input is required/,
      );
    });
  });

  describe('input defaults', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('labelText', 'Amount');
      fixture.detectChanges();
    });

    it('should default scaleType to "linear"', () => {
      expect(fixture.componentInstance.scaleType()).toBe('linear');
    });

    it('should default min to undefined', () => {
      expect(fixture.componentInstance.min()).toBeUndefined();
    });

    it('should default max to undefined', () => {
      expect(fixture.componentInstance.max()).toBeUndefined();
    });

    it('should default allowMinOverflow to false', () => {
      expect(fixture.componentInstance.allowMinOverflow()).toBeFalse();
    });

    it('should default allowMaxOverflow to false', () => {
      expect(fixture.componentInstance.allowMaxOverflow()).toBeFalse();
    });
  });

  it('should reflect the "logarithmic" scaleType input', () => {
    fixture.componentRef.setInput('labelText', 'Amount');
    fixture.componentRef.setInput('scaleType', 'logarithmic');
    fixture.detectChanges();

    expect(mockRegistry.upsertMeasureAxis).toHaveBeenCalledWith(
      jasmine.objectContaining<SkyChartMeasureAxisConfig>({
        scaleType: 'logarithmic',
      }),
    );
  });

  it('should reflect min and max inputs', () => {
    fixture.componentRef.setInput('labelText', 'Amount');
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 100);
    fixture.detectChanges();

    expect(mockRegistry.upsertMeasureAxis).toHaveBeenCalledWith(
      jasmine.objectContaining<SkyChartMeasureAxisConfig>({
        min: 0,
        max: 100,
      }),
    );
  });

  it('should reflect allowMinOverflow and allowMaxOverflow inputs', () => {
    fixture.componentRef.setInput('labelText', 'Amount');
    fixture.componentRef.setInput('allowMinOverflow', true);
    fixture.componentRef.setInput('allowMaxOverflow', true);
    fixture.detectChanges();

    expect(mockRegistry.upsertMeasureAxis).toHaveBeenCalledWith(
      jasmine.objectContaining<SkyChartMeasureAxisConfig>({
        allowMinOverflow: true,
        allowMaxOverflow: true,
      }),
    );
  });

  it('should support tuple labelText', () => {
    fixture.componentRef.setInput('labelText', ['Primary', 'Secondary']);
    fixture.detectChanges();

    expect(mockRegistry.upsertMeasureAxis).toHaveBeenCalledWith(
      jasmine.objectContaining<SkyChartMeasureAxisConfig>({
        labelText: ['Primary', 'Secondary'],
      }),
    );
  });

  it('should produce a complete axis config', () => {
    fixture.componentRef.setInput('labelText', 'Revenue');
    fixture.componentRef.setInput('scaleType', 'logarithmic');
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 1000);
    fixture.componentRef.setInput('allowMinOverflow', true);
    fixture.componentRef.setInput('allowMaxOverflow', false);
    fixture.detectChanges();

    expect(mockRegistry.upsertMeasureAxis).toHaveBeenCalledWith({
      labelText: 'Revenue',
      scaleType: 'logarithmic',
      min: 10,
      max: 1000,
      allowMinOverflow: true,
      allowMaxOverflow: false,
    } satisfies SkyChartMeasureAxisConfig);
  });
});
