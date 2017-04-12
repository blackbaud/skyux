import { Component, Input } from '@angular/core';

import { StacheNav, StacheNavLink, StacheNavComponent } from '../nav';

@Component({
  selector: 'stache-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss']
})
export class StacheActionButtonsComponent extends StacheNavComponent implements StacheNav {
  @Input()
  public routes: StacheNavLink[];
}
