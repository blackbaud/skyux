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
  styleUrls: ['./demo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageComponent implements OnInit {

  /**
   * The URL to this module's source code repository.
   */
  @Input()
  public gitRepoUrl: string;

  /**
   * The name of the Angular module the consumer will import into their project.
   */
  @Input()
  public moduleName: string;

  /**
   * The name of the NPM package.
   */
  @Input()
  public packageName: string;

  /**
   * The page title.
   */
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
