import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { AgGridDemoRow } from './data';

@Component({
  standalone: true,
  selector: 'app-mark-inactive',
  templateUrl: './mark-inactive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkInactiveComponent implements ICellRendererAngularComp {
  protected markInactiveAriaLabel = '';

  #name: string | undefined;

  public agInit(params: ICellRendererParams<AgGridDemoRow>): void {
    this.#name = params.data?.name;
    this.markInactiveAriaLabel = `Mark ${this.#name} inactive`;
  }

  public refresh(): boolean {
    return false;
  }

  protected markInactive(): void {
    console.error(`Mark inactive action clicked for ${this.#name}`);
  }
}
