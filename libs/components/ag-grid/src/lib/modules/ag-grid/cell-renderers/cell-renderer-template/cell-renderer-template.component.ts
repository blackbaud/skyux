import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';

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
      hasTemplate: false;
      template: undefined;
      context?: unknown;
    };

@Component({
  selector: 'sky-ag-grid-cell-renderer-template',
  standalone: true,
  template: `<ng-container *ngIf="state.hasTemplate">
    <ng-container *ngTemplateOutlet="state.template; context: state.context" />
  </ng-container>`,
  imports: [NgTemplateOutlet, NgIf],
})
export class SkyAgGridCellRendererTemplateComponent
  implements ICellRendererAngularComp
{
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
    const template: TemplateRef<CellRendererTemplateContext> | undefined =
      hasTemplate
        ? (params.colDef?.cellRendererParams
            .template as TemplateRef<CellRendererTemplateContext>)
        : undefined;
    this.state = {
      hasTemplate,
      template,
      context: { value: params.value, row: params.data },
    } as CellState;
  }

  public refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return false;
  }
}
