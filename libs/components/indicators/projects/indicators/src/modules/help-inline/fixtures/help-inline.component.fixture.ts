import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './help-inline.component.fixture.html'
})
export class HelpInlineTestComponent {
  public buttonIsClicked = false;

  public buttonClicked(): void {
    this.buttonIsClicked = true;
  }
}
