import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDocsDemoPageTitleService
} from './demo-page-title.service';

@Component({
  selector: 'sky-docs-demo-page',
  templateUrl: './demo-page.component.html',
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

  constructor(
    private titleService: SkyDocsDemoPageTitleService
  ) { }

  public ngOnInit(): void {
    this.updateTitle();
  }

  private updateTitle(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

}
