/**
 * @deprecated since version 2.15.0. update and use the @skyux/fluid-grid unless major bugs are discovered before full deprecation in v3.
 */

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
