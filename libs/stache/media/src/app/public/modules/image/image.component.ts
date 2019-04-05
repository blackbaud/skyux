import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyImageComponent {
  @Input()
  public captionType: string = 'default';

  @Input()
  public imageSource: string;

  @Input()
  public imageAlt: string = 'image';

  @Input()
  public caption: string;

  @Input()
  public showBorder: boolean;
}
