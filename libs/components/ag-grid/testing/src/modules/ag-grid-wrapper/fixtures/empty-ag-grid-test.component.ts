import { Component } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';

@Component({
  selector: 'app-test',
  template: ` <sky-ag-grid-wrapper data-sky-id="wrapper" />`,
  imports: [SkyAgGridModule],
})
export class EmptyAgGridTestComponent {}
