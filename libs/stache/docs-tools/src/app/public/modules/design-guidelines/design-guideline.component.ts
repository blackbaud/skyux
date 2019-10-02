import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import {
  SkyDocsDesignGuidelineThumbnailComponent
} from './design-guideline-thumbnail.component';

@Component({
  selector: 'sky-docs-design-guideline',
  templateUrl: './design-guideline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDesignGuidelineComponent implements AfterContentInit {

  @Input()
  public heading: string;

  public hasThumbnails = false;

  @ContentChildren(SkyDocsDesignGuidelineThumbnailComponent)
  private thumbnails: QueryList<SkyDocsDesignGuidelineThumbnailComponent>;

  public ngAfterContentInit(): void {
    this.hasThumbnails = !!this.thumbnails.length;
  }

}
