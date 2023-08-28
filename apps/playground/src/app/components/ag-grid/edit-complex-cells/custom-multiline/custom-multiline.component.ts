import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-custom-multiline',
  templateUrl: './custom-multiline.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMultilineComponent implements ICellRendererAngularComp {
  public lines: number;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public agInit(params: ICellRendererParams): void {
    this.lines = (params.rowIndex - 3) % 5;
    this.changeDetectorRef.detectChanges();
  }

  public refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
