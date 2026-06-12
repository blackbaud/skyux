import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-multiline',
  templateUrl: './custom-multiline.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMultilineComponent implements ICellRendererAngularComp {
  public lines: number;

  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  public agInit(params: ICellRendererParams): void {
    this.lines = (params.node?.rowIndex - 3) % 5;
    this.#changeDetectorRef.detectChanges();
  }

  public refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
