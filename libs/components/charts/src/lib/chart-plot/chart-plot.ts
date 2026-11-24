import {
  afterRenderEffect,
  type ComponentMirror,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  reflectComponentType,
  type Type,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisCategoryTime } from '../chart-axis/chart-axis-category-time';
import {
  getTimeAxisError,
  type SkyChartCategoryAxis,
} from '../chart-axis/chart-axis-category-utils';

import { SkyChartTable } from '../chart-table/chart-table';
import {
  SkyChartAccessibleSummary,
  SkyChartTableService,
} from '../chart-table/chart-table-service';
import {
  resolveChartThemeStyles,
  SkyChartThemeStyles,
} from '../shared/chart-theme-styles';

/**
 * Base class for chart plot components (for example, `sky-chart-bar`). Owns the
 * bridge that publishes each plot's tabular representation to the accessible
 * data table, so every plot type shares the same lifecycle, and the category
 * axis content queries and error. Subclasses declare the category axes they
 * support and implement `getChartTable`, `getAccessibleSummary`, and their own
 * rendering.
 *
 * Plots must be rendered inside `sky-chart`: the wrapper provides the data
 * table bridge and the default-theme styling the plot resolves its themed
 * values from.
 * @internal
 */
@Directive()
export abstract class SkyChartPlot {
  readonly #elementRef = inject(ElementRef);

  readonly #tableSvc: SkyChartTableService;

  protected readonly categoryAxisDefault = contentChild(SkyChartAxisCategory);
  protected readonly categoryAxisTime = contentChild(SkyChartAxisCategoryTime);

  protected readonly categoryAxis = computed(
    (): SkyChartCategoryAxis | undefined =>
      this.categoryAxisTime() ?? this.categoryAxisDefault(),
  );

  /**
   * The category axis components the plot can render. Any other category axis
   * logs an error, and the plot should render nothing.
   */
  protected abstract readonly supportedCategoryAxes: readonly Type<SkyChartCategoryAxis>[];

  /**
   * Why the category axis can't be plotted, if it can't.
   */
  protected readonly categoryAxisError = computed(() => {
    const categoryAxis = this.categoryAxis();

    if (!categoryAxis) {
      return undefined;
    }

    if (
      !this.supportedCategoryAxes.some((axis) => categoryAxis instanceof axis)
    ) {
      const plot = tagOf(this.constructor as Type<unknown>);
      const axis = tagOf(categoryAxis.constructor as Type<unknown>);
      const supported = this.supportedCategoryAxes.map(tagOf).join(' or ');

      return `The ${plot} does not support ${axis}. Use ${supported} instead.`;
    }

    return categoryAxis instanceof SkyChartAxisCategoryTime
      ? getTimeAxisError(categoryAxis)
      : undefined;
  });

  constructor() {
    const tableSvc = inject(SkyChartTableService, { optional: true });

    if (!tableSvc) {
      const tagName = (
        this.#elementRef.nativeElement as HTMLElement
      ).tagName.toLowerCase();

      throw new Error(
        `The <${tagName}> component must be rendered inside a <sky-chart> ` +
          'component.',
      );
    }

    this.#tableSvc = tableSvc;

    inject(DestroyRef).onDestroy(() => {
      this.#tableSvc.table.set(undefined);
      this.#tableSvc.summary.set(undefined);
    });

    const logger = inject(SkyLogService);

    afterRenderEffect(() => {
      const error = this.categoryAxisError();

      if (error) {
        logger.error(error);
      }
    });

    afterRenderEffect(() => {
      this.#tableSvc.table.set(this.getChartTable());
      this.#tableSvc.summary.set(this.getAccessibleSummary());
    });
  }

  /**
   * Builds the tabular representation of the plotted content for the accessible
   * data table, or `undefined` when the plot has no data to represent.
   */
  protected abstract getChartTable(): SkyChartTable | undefined;

  /**
   * Builds the localized, descriptive summary used as the chart figure's
   * accessible name, or `undefined` when the plot has no data to represent.
   */
  protected abstract getAccessibleSummary():
    SkyChartAccessibleSummary | undefined;

  /**
   * Resolves the active theme's chart styling against this plot's element.
   * Chart.js renders to a canvas that cannot read CSS variables, so themed
   * tokens must be resolved to concrete values against the DOM.
   */
  protected getThemeStyles(): SkyChartThemeStyles {
    return resolveChartThemeStyles(
      this.#elementRef.nativeElement as HTMLElement,
    );
  }
}

function tagOf(component: Type<unknown>): string {
  const { selector } = reflectComponentType(
    component,
  ) as ComponentMirror<unknown>;

  return `<${selector}>`;
}
