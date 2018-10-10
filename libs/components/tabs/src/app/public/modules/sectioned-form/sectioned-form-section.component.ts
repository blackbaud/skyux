import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import {
  SkyVerticalTabComponent
} from './../vertical-tabset/vertical-tab.component';
import {
  SkySectionedFormService
} from './sectioned-form.service';
import {
  SkyVerticalTabsetService
} from '../vertical-tabset/vertical-tabset.service';

let nextId = 0;

@Component({
  selector: 'sky-sectioned-form-section',
  templateUrl: './sectioned-form-section.component.html',
  providers: [SkySectionedFormService],
  styleUrls: ['./sectioned-form-section.component.scss']
})
export class SkySectionedFormSectionComponent implements OnInit, OnDestroy {
  public sectionTabId = `sky-sectioned-form-tab-${++nextId}`;
  public sectionContentId = `sky-sectioned-form-section-${++nextId}`;

  @Input()
  public heading: string;

  @Input()
  public itemCount: number;

  @Input()
  public active: boolean;

  public get ariaRole(): string {
    return this.isMobile ? undefined : 'tabpanel';
  }

  public get ariaLabelledby() {
    return this.isMobile ? undefined : this.sectionTabId;
  }

  public fieldRequired: boolean;
  public fieldInvalid: boolean;

  @ViewChild(SkyVerticalTabComponent)
  public tab: SkyVerticalTabComponent;

  private isMobile = false;
  private _ngUnsubscribe = new Subject();

  constructor(
    private sectionedFormService: SkySectionedFormService,
    private tabsetService: SkyVerticalTabsetService,
    private changeRef: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.isMobile = this.tabsetService.isMobile();
    this.changeRef.detectChanges();

    this.tabsetService.switchingMobile
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeRef.detectChanges();
      });

    this.sectionedFormService.requiredChange
      .takeUntil(this._ngUnsubscribe)
      .subscribe((required: boolean) => this.fieldRequired = required);

    this.sectionedFormService.invalidChange
      .takeUntil(this._ngUnsubscribe)
      .subscribe((invalid: boolean) => this.fieldInvalid = invalid);
  }

  public ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
