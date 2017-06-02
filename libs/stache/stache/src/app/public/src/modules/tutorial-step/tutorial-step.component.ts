import { Component, Input } from '@angular/core';

import { InputConverter } from '../shared';
@Component({
  selector: 'stache-tutorial-step',
  templateUrl: './tutorial-step.component.html',
  styleUrls: ['./tutorial-step.component.scss']
})
export class StacheTutorialStepComponent {
  @Input()
  @InputConverter()
  public showNumber: boolean = true;
}
