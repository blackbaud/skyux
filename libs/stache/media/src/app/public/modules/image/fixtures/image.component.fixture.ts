import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-test-image-cmp',
  templateUrl: './image.component.fixture.html'
})
export class SkyImageTestComponent {
  public captionType: string = 'default';

  public imageSource: string;

  public imageAlt: string = '';

  public caption: string;

  public showBorder: boolean;
}
