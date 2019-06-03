import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDocsDemoPageDesignGuidelinesComponent
} from './demo-page-design-guidelines.component';

import {
  SkyDocsDemoPageTitleService
} from './demo-page-title.service';

@Component({
  selector: 'sky-docs-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageComponent implements OnInit {

  @Input()
  public gitRepoUrl: string;

  @Input()
  public moduleName: string;

  @Input()
  public packageName: string;

  @Input()
  public pageTitle: string;

  public useTabLayout = false;

  @ContentChild(SkyDocsDemoPageDesignGuidelinesComponent)
  private designGuidelines: SkyDocsDemoPageDesignGuidelinesComponent;

  constructor(
    private titleService: SkyDocsDemoPageTitleService
  ) { }

  public ngOnInit(): void {
    this.updateTitle();
  }

  public ngAfterContentInit(): void {
    this.useTabLayout = !!(this.designGuidelines);
  }

  private updateTitle(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

}
