import {
  Component,
  ViewChild
} from '@angular/core';

import {
  StacheAffixComponent
} from '../affix.component';

@Component({
  selector: 'stache-test-component',
  templateUrl: './affix.component.fixture.html'
})
export class AffixFixtureComponent {

  @ViewChild(StacheAffixComponent)
  public affixComponent: StacheAffixComponent;

}
