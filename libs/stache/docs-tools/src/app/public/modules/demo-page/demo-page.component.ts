import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList
} from '@angular/core';

import {
  SkyDocsCodeExamplesComponent
} from '../code-examples/code-examples.component';

import {
  SkyDocsDemoComponent
} from '../demo/demo.component';

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
export class SkyDocsDemoPageComponent implements OnInit, AfterContentInit {

  @Input()
  public gitRepoUrl: string;

  @Input()
  public moduleName: string;

  @Input()
  public packageName: string;

  @Input()
  public pageTitle: string;

  @Input()
  public sourceCodeLocation: string;

  public enableCodeExamples = false;
  public enableDemo = false;
  public enableTabLayout = false;

  @ContentChild(SkyDocsDemoPageDesignGuidelinesComponent)
  private designGuidelinesComponent: SkyDocsDemoPageDesignGuidelinesComponent;

  @ContentChildren(SkyDocsDemoComponent)
  private demoComponents: QueryList<SkyDocsDemoComponent>;

  @ContentChildren(SkyDocsCodeExamplesComponent)
  private codeExampleComponents: QueryList<SkyDocsCodeExamplesComponent>;

  constructor(
    private titleService: SkyDocsDemoPageTitleService
  ) { }

  public ngOnInit(): void {
    this.updateTitle();
  }

  public ngAfterContentInit(): void {
    this.enableCodeExamples = (this.codeExampleComponents.length > 0);
    this.enableDemo = (this.demoComponents.length > 0);
    this.enableTabLayout = !!(this.designGuidelinesComponent);
  }

  private updateTitle(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

}
