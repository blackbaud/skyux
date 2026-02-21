import { NgTemplateOutlet } from '@angular/common';
import { Component, Signal, TemplateRef, isSignal } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { CellRendererTemplateContext } from './cell-renderer-template-context.type';

type CellState =
  | {
      hasTemplate: true;
      template: TemplateRef<CellRendererTemplateContext>;
      context: CellRendererTemplateContext;
    }
  | {
      hasTemplate: 'signal';
      template: Signal<TemplateRef<CellRendererTemplateContext>>;
      context: CellRendererTemplateContext;
    }
  | {
      hasTemplate: false;
      template: undefined;
      context?: unknown;
    };

@Component({
  selector: 'sky-ag-grid-cell-renderer-template',
  template: `@if (state.hasTemplate === 'signal') {
      <ng-container
        *ngTemplateOutlet="state.template(); context: state.context"
      />
    } @else if (state.hasTemplate) {
      <ng-container
        *ngTemplateOutlet="state.template; context: state.context"
      />
    }`,
  imports: [NgTemplateOutlet],
})
export class SkyAgGridCellRendererTemplateComponent implements ICellRendererAngularComp {
  protected state: CellState = {
    hasTemplate: false,
    template: undefined,
    context: { value: undefined, data: undefined },
  };

  public agInit(params: ICellRendererParams): void {
    const hasTemplate = !!(
      params.colDef?.cellRendererParams &&
      'template' in params.colDef.cellRendererParams &&
      params.colDef.cellRendererParams.template
    );
    const template:
      | TemplateRef<CellRendererTemplateContext>
      | Signal<TemplateRef<CellRendererTemplateContext>>
      | undefined = hasTemplate
      ? (params.colDef?.cellRendererParams.template as
          | TemplateRef<CellRendererTemplateContext>
          | Signal<TemplateRef<CellRendererTemplateContext>>)
      : undefined;
    this.state = {
      hasTemplate: isSignal(template) ? 'signal' : hasTemplate,
      template,
      context: { value: params.value, row: params.data },
    } as CellState;
  }

  public refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return false;
  }
}
