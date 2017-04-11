import { Component, Input } from '@angular/core';

import { InputConverter } from '../shared';

@Component({
  selector: 'stache-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class StacheRowComponent {
  @Input()
  @InputConverter()
  public reverseColumnOrder: boolean = false;
}
