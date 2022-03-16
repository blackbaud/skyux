import {
  Component,
  Input
} from '@angular/core';

import {
  booleanConverter,
  InputConverter
} from '../shared/input-converter';

@Component({
  selector: 'stache-tutorial-step',
  templateUrl: './tutorial-step.component.html',
  styleUrls: ['./tutorial-step.component.scss']
})
export class StacheTutorialStepComponent {
  @Input()
  @InputConverter(booleanConverter)
  public showNumber = true;
}
