import { Component } from '@angular/core';

import { delay, of } from 'rxjs';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: false,
})
export class AvatarComponent {
  public name = 'Robert C. Hernandez';

  protected readonly ready = of(true).pipe(delay(400));
}
