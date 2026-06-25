import { Component, ViewChild, input } from '@angular/core';

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

  public canChange = input<boolean>(false);

  public maxFileSize = input<number>(512000);

  public name = input<string | undefined>(undefined);

  public size = input<SkyAvatarSize | undefined>(undefined);

  public src = input<SkyAvatarSrc | undefined>(undefined);
}
