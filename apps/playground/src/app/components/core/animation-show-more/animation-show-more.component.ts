import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { _SkyAnimationShowMoreComponent } from '@skyux/core';

@Component({
  selector: 'app-animation-show-more',
  templateUrl: './animation-show-more.component.html',
  imports: [FormsModule, _SkyAnimationShowMoreComponent],
})
export default class AnimationShowMoreComponent {
  protected minHeight = signal('0');
  protected opened = false;
}
