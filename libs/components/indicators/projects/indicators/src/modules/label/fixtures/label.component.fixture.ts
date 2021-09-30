import {
  Component
} from '@angular/core';

import {
  SkyLabelType
} from '../label-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './label.component.fixture.html'
})
export class LabelTestComponent {
  public labelType: SkyLabelType;
}
