import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart, ChartConfiguration } from 'chart.js';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

import { SkyChartJsDirective } from './chartjs.directive';

describe('SkyChartJsDirective', () => {
  describe('initialization', () => {
    it('should create a Chart instance after view init', () => {
      const { component } = setupTest();

      expect(component.directive().chart()).toBeInstanceOf(Chart);
    });
  });

  describe('host attributes', () => {
    it('should set tabindex="0" on the canvas element', () => {
      const { fixture } = setupTest();

      expect(getCanvas(fixture).getAttribute('tabindex')).toBe('0');
    });

    it('should set role="application" on the canvas element', () => {
      const { fixture } = setupTest();

      expect(getCanvas(fixture).getAttribute('role')).toBe('application');
    });

    it('should set aria-label from the ariaLabel input', () => {
      const { fixture } = setupTest();

      expect(getCanvas(fixture).getAttribute('aria-label')).toBe('Test Chart');
    });

    it('should update aria-label when the input changes', () => {
      const { fixture, component } = setupTest();

      component.ariaLabel.set('Updated Label');
      fixture.detectChanges();

      expect(getCanvas(fixture).getAttribute('aria-label')).toBe(
        'Updated Label',
      );
    });

    it('should set aria-roledescription from resources', () => {
      const { fixture } = setupTest();

      expect(getCanvas(fixture).getAttribute('aria-roledescription')).toBe(
        'chart',
      );
    });

    it('should set the outline style to none', () => {
      const { fixture } = setupTest();

      expect(getCanvas(fixture).style.outline).toBe('none');
    });
  });

  describe('chart configuration updates', () => {
    it('should call chart.update() when chartConfiguration changes', () => {
      const { fixture, component } = setupTest();
      const chart = getChartInstance(component);
      const updateSpy = spyOn(chart, 'update').and.callThrough();

      const newConfig = createBaseConfig();
      newConfig.data.datasets[0].data = [3, 4];
      component.chartConfiguration.set(newConfig);
      fixture.detectChanges();

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should update chart.data when configuration changes', () => {
      const { fixture, component } = setupTest();
      const chart = getChartInstance(component);
      const newData: ChartConfiguration['data'] = {
        labels: ['X', 'Y'],
        datasets: [{ data: [5, 6] }],
      };

      component.chartConfiguration.set({
        type: 'bar',
        data: newData,
        options: { responsive: false, animation: false },
      });
      fixture.detectChanges();

      expect(chart.data).toEqual(newData);
    });

    it('should merge new options into chart.config.options', () => {
      const { fixture, component } = setupTest();
      const chart = getChartInstance(component);

      component.chartConfiguration.set({
        ...createBaseConfig(),
        options: {
          responsive: false,
          animation: false,
          plugins: { legend: { display: false } },
        },
      });
      fixture.detectChanges();

      expect(chart.config.options?.plugins?.legend?.display).toBeFalse();
    });

    it('should emit chartUpdated after the chart is updated', () => {
      const { fixture, component } = setupTest();
      const initialCount = component.chartUpdatedCount;

      component.chartConfiguration.set({
        ...createBaseConfig(),
        data: { labels: ['C', 'D'], datasets: [{ data: [9, 10] }] },
      });
      fixture.detectChanges();

      expect(component.chartUpdatedCount).toBe(initialCount + 1);
    });
  });

  describe('error handling', () => {
    it('should throw if canvas context cannot be created', () => {
      spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(null);

      TestBed.configureTestingModule({
        imports: [SkyChartTypeFixture, SkyChartsResourcesModule],
      });

      expect(() => TestBed.createComponent(SkyChartTypeFixture)).toThrowError(
        'Cannot create chart without a canvas',
      );
    });
  });

  describe('destruction', () => {
    it('should call chart.destroy() when the directive is destroyed', () => {
      const { fixture, component } = setupTest();
      const chart = getChartInstance(component);
      const destroySpy = spyOn(chart, 'destroy').and.callThrough();

      fixture.destroy();

      expect(destroySpy).toHaveBeenCalled();
    });

    it('should set the chart signal to undefined after destruction', () => {
      const { fixture, component } = setupTest();
      const directive = component.directive();

      fixture.destroy();

      expect(directive.chart()).toBeUndefined();
    });
  });
});

// #region Test Helpers
function setupTest(): {
  fixture: ComponentFixture<SkyChartTypeFixture>;
  component: SkyChartTypeFixture;
} {
  TestBed.configureTestingModule({
    imports: [SkyChartTypeFixture, SkyChartsResourcesModule],
  });

  const fixture = TestBed.createComponent(SkyChartTypeFixture);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component };
}

@Component({
  selector: 'sky-chart-type-fixture',
  template: `
    <canvas
      skyChartJs
      [chartConfiguration]="chartConfiguration()"
      [ariaLabel]="ariaLabel()"
      (chartUpdated)="onChartUpdated()"
    ></canvas>
  `,
  imports: [SkyChartJsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SkyChartTypeFixture {
  public readonly chartConfiguration =
    signal<ChartConfiguration>(createBaseConfig());
  public readonly ariaLabel = signal('Test Chart');
  public chartUpdatedCount = 0;
  public readonly directive = viewChild.required(SkyChartJsDirective);

  public onChartUpdated(): void {
    this.chartUpdatedCount++;
  }
}

function createBaseConfig(): ChartConfiguration {
  return {
    type: 'bar',
    data: {
      labels: ['A', 'B'],
      datasets: [{ data: [1, 2], label: 'Dataset 1' }],
    },
  };
}

function getCanvas(
  fixture: ComponentFixture<SkyChartTypeFixture>,
): HTMLCanvasElement {
  return fixture.nativeElement.querySelector('canvas') as HTMLCanvasElement;
}

function getChartInstance(component: SkyChartTypeFixture): Chart {
  const chart = component.directive().chart();
  if (!chart) {
    throw new Error('Chart instance is not defined');
  }
  return chart;
}
// #endregion
