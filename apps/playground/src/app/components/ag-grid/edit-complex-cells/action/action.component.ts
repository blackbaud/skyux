import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  selector: 'app-action',
  templateUrl: './action.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ActionComponent implements ICellRendererAngularComp {
  protected showAction = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public agInit(params: ICellRendererParams): void {
    this.showAction = !!params?.value;
    this.changeDetectorRef.detectChanges();
  }

  public refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }

  public click() {
    alert('Action');
  }
}
