import { Signal, TemplateRef } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-community';

import { SkyCellRendererTemplateContext } from './cell-renderer-template-context';

/**
 * Parameters for the template cell renderer.
 */
export interface SkyCellRendererTemplateParams extends ICellRendererParams {
  /**
   * The template to render in the cell, with `value` and `row` context.
   */
  template?:
    | TemplateRef<SkyCellRendererTemplateContext>
    | Signal<TemplateRef<SkyCellRendererTemplateContext>>;
}
