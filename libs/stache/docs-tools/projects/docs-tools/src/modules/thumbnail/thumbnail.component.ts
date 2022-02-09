import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sky-docs-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsThumbnailComponent {
  @Input()
  public caption: string;

  @Input()
  public captionType: string;

  @Input()
  public imageAlt: string;

  @Input()
  public imageSource: string;

  @Input()
  public showBorder: boolean = false;

  @Input()
  public videoSource: string;
}
