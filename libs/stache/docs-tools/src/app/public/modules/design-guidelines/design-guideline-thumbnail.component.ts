import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-design-guideline-thumbnail',
  templateUrl: './design-guideline-thumbnail.component.html',
  styleUrls: ['./design-guideline-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDesignGuidelineThumbnailComponent {

  @Input()
  public imageSource: string;

  @Input()
  public imageAlt: string;

  @Input()
  public caption: string;

  @Input()
  public captionType: string;

  @Input()
  public showBorder: boolean = false;

}
