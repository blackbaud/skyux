import {
  afterRenderEffect,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SkyChartTable } from '../chart-table/chart-table';
import {
  SkyChartAccessibleSummary,
  SkyChartTableService,
} from '../chart-table/chart-table-service';
import {
  resolveChartThemeStyles,
  SkyChartThemeStyles,
} from './chart-theme-styles';

/**
 * Base class for chart plot components (for example, `sky-chart-bar`). Owns the
 * bridge that publishes each plot's tabular representation to the accessible
 * data table, so every plot type shares the same lifecycle. Subclasses
 * implement `buildTable` and their own rendering.
 *
 * Plots must be rendered inside `sky-chart`: the wrapper provides the data
 * table bridge and the default-theme styling the plot resolves its themed
 * values from.
 * @internal
 */
@Directive()
export abstract class SkyChartPlot {
  readonly #elementRef = inject(ElementRef);
  readonly #logSvc = inject(SkyLogService);
  readonly #tableSvc: SkyChartTableService;

  #warnedMissingTheme = false;

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

    afterRenderEffect(() => {
      this.#tableSvc.table.set(this.buildTable());
      this.#tableSvc.summary.set(this.buildSummary());
    });
  }

  /**
   * Builds the tabular representation of the plotted content for the accessible
   * data table, or `undefined` when the plot has no data to represent.
   */
  protected abstract buildTable(): SkyChartTable | undefined;

  /**
   * Builds the localized, descriptive summary used as the chart figure's
   * accessible name, or `undefined` when the plot has no data to represent.
   */
  protected abstract buildSummary(): SkyChartAccessibleSummary | undefined;

  /**
   * Resolves the active theme's chart styling against this plot's element.
   * Chart.js renders to a canvas that cannot read CSS variables, so themed
   * tokens must be resolved to concrete values against the DOM. Warns once
   * per plot when the SKY theme styles are not loaded.
   */
  protected getThemeStyles(): SkyChartThemeStyles {
    return resolveChartThemeStyles(
      this.#elementRef.nativeElement as HTMLElement,
      (message) => {
        if (!this.#warnedMissingTheme) {
          this.#warnedMissingTheme = true;
          this.#logSvc.warn(message);
        }
      },
    );
  }
}
