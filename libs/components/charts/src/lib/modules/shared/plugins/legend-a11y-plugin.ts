import type { Chart, Plugin } from 'chart.js';

import { getChartType } from '../chart-helpers';

export function createLegendA11yPlugin(): Plugin {
  const plugin: Plugin = {
    id: 'sky_legend_a11y',
    afterInit: (chart) => {
      const manager = initialize(chart);
      updateForLegends(chart, manager);
    },
    beforeDraw: (chart) => {
      let manager = chartStates.get(chart);

      if (manager === undefined) {
        manager = initialize(chart);
      }

      if (!chart.options.plugins?.legend?.display) {
        manager.suppressFocusBox();
        return;
      }

      manager.reviveFocusBox();
      updateForLegends(chart, manager);
    },
    afterDestroy(chart: Chart) {
      chartStates.delete(chart);
    },
  };

  return plugin;
}

const chartStates = new Map<Chart, ChartLegendManager>();

interface HitBoxMeta {
  left: number;
  top: number;
  width: number;
  height: number;
  text: string;
  hidden: boolean;
}

class ChartLegendManager {
  public hitBoxes: HitBoxMeta[] = [];
  public readonly focusBoxMargin = 4;
  public focusBox: HTMLDivElement;
  public readonly chart: Chart;
  public readonly canvas: HTMLCanvasElement;

  constructor(chart: Chart) {
    this.chart = chart;
    this.canvas = chart.canvas;
    this.focusBox = this.#generateFocusBox();
    this.chart.canvas.insertAdjacentElement('afterend', this.focusBox);
  }

  public suppressFocusBox(): void {
    this.focusBox.setAttribute('tabIndex', '-1');
  }

  public reviveFocusBox(): void {
    this.focusBox.setAttribute('tabIndex', '0');
  }

  #generateFocusBox(): HTMLDivElement {
    const focusBox = document.createElement('div');
    focusBox.setAttribute('tabIndex', '0');
    focusBox.setAttribute('data-legend-index', '0');
    focusBox.setAttribute('role', 'option');
    focusBox.style.position = 'absolute';

    const hideFocusBox = (): void => {
      focusBox.style.left = '-1000px';
    };

    const activateFocusBox = (e: KeyboardEvent | MouseEvent): void => {
      const index = Number(focusBox.getAttribute('data-legend-index'));

      const chartType = getChartType(this.chart);

      if (['pie', 'doughnut'].includes(chartType)) {
        this.chart.toggleDataVisibility(index);
        const isVisible = this.chart.getDataVisibility(index);
        focusBox.setAttribute(
          'aria-label',
          isVisible ? 'Selected' : 'Not selected',
        );
      } else {
        if (this.chart.isDatasetVisible(index)) {
          this.chart.hide(index);
          focusBox.setAttribute('aria-label', 'Not selected');
        } else {
          this.chart.show(index);
          focusBox.setAttribute('aria-label', 'Selected');
        }
      }
      this.chart.update();
      e.preventDefault();
      e.stopPropagation();
    };

    const keyboardNavigation = (e: KeyboardEvent): void => {
      const index = Number(focusBox.getAttribute('data-legend-index'));
      const maxIndex = this.hitBoxes.length - 1;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        if (index >= maxIndex) {
          return;
        }
        focusBox.setAttribute('data-legend-index', String(index + 1));
        moveFocusBox();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        if (index <= 0) {
          return;
        }
        focusBox.setAttribute('data-legend-index', String(index - 1));
        moveFocusBox();
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        activateFocusBox(e);
        return;
      }
    };

    const moveFocusBox = (): void => {
      const index = Number(focusBox.getAttribute('data-legend-index'));
      if (isNaN(index)) {
        return;
      }

      const useOffset =
        this.canvas.offsetParent !== null &&
        !['BODY', 'HTML'].includes(this.canvas.offsetParent.nodeName);

      const bbox = this.canvas.getBoundingClientRect();
      const adjustment = useOffset
        ? (this.canvas.offsetParent as HTMLElement).getBoundingClientRect()
        : { x: 0 - window.scrollX, y: 0 - window.scrollY };

      const { left, top, width, height, text, hidden } = this.hitBoxes[index];

      focusBox.style.left = `${bbox.x - adjustment.x + left - this.focusBoxMargin}px`;
      focusBox.style.top = `${bbox.y - adjustment.y + top - this.focusBoxMargin}px`;
      focusBox.style.width = `${width + 2 * this.focusBoxMargin}px`;
      focusBox.style.height = `${height + 2 * this.focusBoxMargin}px`;
      focusBox.setAttribute(
        'aria-label',
        `${text}, ${hidden ? 'not selected' : 'selected'}, ${index + 1} of ${this.hitBoxes.length}`,
      );
    };

    hideFocusBox();

    focusBox.addEventListener('focus', moveFocusBox);
    focusBox.addEventListener('blur', hideFocusBox);
    focusBox.addEventListener('keydown', keyboardNavigation);
    focusBox.addEventListener('click', activateFocusBox);

    return focusBox;
  }
}

function updateForLegends(chart: Chart, manager: ChartLegendManager): void {
  const { legend } = chart;

  if (!legend?.legendItems) {
    return manager.suppressFocusBox();
  }

  manager.hitBoxes =
    legend?.legendItems?.map(({ text, hidden }, index) => {
      return {
        // @ts-expect-error Chart.js private property access
        ...(legend.legendHitBoxes?.[index] ?? {}),
        text,
        hidden,
      };
    }) ?? [];
}

function initialize(chart: Chart): ChartLegendManager {
  const manager = new ChartLegendManager(chart);
  chartStates.set(chart, manager);
  return manager;
}
