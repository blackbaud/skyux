import { Component, ViewChild } from '@angular/core';

import { SkyAvatarSize } from '../avatar-size';
import { SkyAvatarSrc } from '../avatar-src';
import { SkyAvatarComponent } from '../avatar.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './avatar.component.fixture.html',
})
export class AvatarTestComponent {
  @ViewChild(SkyAvatarComponent)
  public avatarComponent: SkyAvatarComponent;

  public maxFileSize = 500000;

  public name: string;

  public size: SkyAvatarSize;

  public src: SkyAvatarSrc;
}
