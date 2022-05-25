import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-ag-grid-stylesheet',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./ag-grid-stylesheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgGridStylesheetComponent {}
