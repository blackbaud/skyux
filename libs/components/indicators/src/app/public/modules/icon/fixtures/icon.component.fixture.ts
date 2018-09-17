import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './icon.component.fixture.html'
})
export class IconTestComponent {
  public icon = 'circle';
  public size = '3x';
  public fixedWidth = false;
}
