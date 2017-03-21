import { Component, Input } from '@angular/core';

import { StacheLayout } from './layout';

@Component({
  selector: 'stache-layout-default',
  templateUrl: './layout-default.component.html'
})
export class StacheLayoutDefaultComponent implements StacheLayout {
  @Input()
  public pageTitle: string;
}
