import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyAvatarComponent
} from '../avatar.component';

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

  @ViewChild(SkyAvatarComponent)
  public avatarComponent: SkyAvatarComponent;

  public src: SkyAvatarSrc;

  public name: string;

  public size: SkyAvatarSize;
}
