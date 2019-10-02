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

  @Input()
  public headingStyle: 'default' | 'success' | 'danger' = 'default';

  public get classNames(): string {
    const classNames: string[] = [
      'sky-docs-h3'
    ];

    classNames.push(`sky-text-${this.headingStyle}`);

    return classNames.join(' ');
  }

  public hasThumbnails = false;

  @ContentChildren(SkyDocsDesignGuidelineThumbnailComponent)
  private thumbnails: QueryList<SkyDocsDesignGuidelineThumbnailComponent>;

  public ngAfterContentInit(): void {
    this.hasThumbnails = !!this.thumbnails.length;
  }

}
