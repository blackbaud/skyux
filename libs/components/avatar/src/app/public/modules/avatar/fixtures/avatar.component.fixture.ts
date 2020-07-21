import {
  Component
} from '@angular/core';

import {
  SkyAvatarSize
} from '../avatar-size';

import {
  SkyAvatarSrc
} from '../avatar-src';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './avatar.component.fixture.html'
})
export class AvatarTestComponent {
  public src: SkyAvatarSrc;

  public name: string;

  public size: SkyAvatarSize;
}
