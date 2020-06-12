import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-input-box-fixture',
  templateUrl: './input-box.component.fixture.html'
})
export class InputBoxFixtureComponent {

  @Input()
  public basicDisabled: boolean;

}
