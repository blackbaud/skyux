import { Component, ViewChild } from '@angular/core';

import { SkyAvatarSize } from '../avatar-size';
import { SkyAvatarSrc } from '../avatar-src';
import { SkyAvatarComponent } from '../avatar.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './avatar.component.fixture.html',
  standalone: false,
})
export class AvatarTestComponent {
  @ViewChild(SkyAvatarComponent)
  public avatarComponent!: SkyAvatarComponent;

  public maxFileSize = 512000;

  public name: string | undefined;

  public size: SkyAvatarSize | undefined;

  public src: SkyAvatarSrc | undefined;
}
