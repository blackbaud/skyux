import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyVerticalTabsetService } from '../vertical-tabset/vertical-tabset.service';

import { SkyVerticalTabComponent } from './../vertical-tabset/vertical-tab.component';
import { SkySectionedFormService } from './sectioned-form.service';

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
  public heading: string | undefined;

  /**
   * Indicates the number of items within the section and displays a
   * counter alongside the section header.
   */
  @Input()
  public itemCount: number | undefined;

  /**
   * Indicates whether the section is active when the form loads.
   * @default false
   */
  @Input()
  public active: boolean | undefined = false;

  public fieldRequired: boolean | undefined;
  public fieldInvalid: boolean | undefined;

  @ViewChild(SkyVerticalTabComponent)
  public tab: SkyVerticalTabComponent | undefined;

  #ngUnsubscribe = new Subject<void>();

  #sectionedFormService: SkySectionedFormService;
  #tabsetService: SkyVerticalTabsetService;
  #changeRef: ChangeDetectorRef;

  constructor(
    sectionedFormService: SkySectionedFormService,
    tabsetService: SkyVerticalTabsetService,
    changeRef: ChangeDetectorRef
  ) {
    this.#sectionedFormService = sectionedFormService;
    this.#tabsetService = tabsetService;
    this.#changeRef = changeRef;
  }

  public ngOnInit() {
    this.#changeRef.detectChanges();

    this.#tabsetService.switchingMobile.subscribe((mobile: boolean) => {
      this.#changeRef.detectChanges();
    });

    this.#sectionedFormService.requiredChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(
        (required: boolean | undefined) => (this.fieldRequired = required)
      );

    this.#sectionedFormService.invalidChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(
        (invalid: boolean | undefined) => (this.fieldInvalid = invalid)
      );
  }

  public ngOnDestroy() {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
