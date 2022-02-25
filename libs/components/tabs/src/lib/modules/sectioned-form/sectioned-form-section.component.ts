import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { SkyVerticalTabComponent } from './../vertical-tabset/vertical-tab.component';
import { SkySectionedFormService } from './sectioned-form.service';
import { SkyVerticalTabsetService } from '../vertical-tabset/vertical-tabset.service';

let nextId = 0;

/**
 * Creates an individual form to display as a section within the sectioned form.
 */
@Component({
  selector: 'sky-sectioned-form-section',
  templateUrl: './sectioned-form-section.component.html',
  providers: [SkySectionedFormService],
  styleUrls: ['./sectioned-form-section.component.scss'],
})
export class SkySectionedFormSectionComponent implements OnInit, OnDestroy {
  public sectionTabId = `sky-sectioned-form-tab-${++nextId}`;
  public sectionContentId = `sky-sectioned-form-section-${++nextId}`;

  /**
   * Specifies the section header.
   * @required
   */
  @Input()
  public heading: string;

  /**
   * Indicates the number of items within the section and displays a
   * counter alongside the section header.
   */
  @Input()
  public itemCount: number;

  /**
   * Indicates whether the section is active when the form loads.
   * @default false
   */
  @Input()
  public active: boolean = false;

  public fieldRequired: boolean;
  public fieldInvalid: boolean;

  @ViewChild(SkyVerticalTabComponent)
  public tab: SkyVerticalTabComponent;

  private _ngUnsubscribe = new Subject();

  constructor(
    private sectionedFormService: SkySectionedFormService,
    private tabsetService: SkyVerticalTabsetService,
    private changeRef: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.changeRef.detectChanges();

    this.tabsetService.switchingMobile.subscribe((mobile: boolean) => {
      this.changeRef.detectChanges();
    });

    this.sectionedFormService.requiredChange
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((required: boolean) => (this.fieldRequired = required));

    this.sectionedFormService.invalidChange
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((invalid: boolean) => (this.fieldInvalid = invalid));
  }

  public ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
