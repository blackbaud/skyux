import { Component, inject } from '@angular/core';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { delay } from 'rxjs';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: false,
})
export class AvatarComponent {
  public name = 'Robert C. Hernandez';

  protected readonly ready = inject(FontLoadingService)
    .ready()
    .pipe(delay(400));
}
