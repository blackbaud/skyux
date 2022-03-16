import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-image-cmp',
  templateUrl: './image.component.fixture.html',
})
export class SkyImageTestComponent {
  public caption: string;

  public captionType = 'default';

  public imageAlt = '';

  public imageSource: string;

  public showBorder: boolean;

  public showCaptionPrefix: boolean;
}
