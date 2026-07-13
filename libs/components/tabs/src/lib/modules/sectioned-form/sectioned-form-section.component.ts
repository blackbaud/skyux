import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkySectionedFormSectionComponent implements OnInit, OnDestroy {
  public sectionTabId = `sky-sectioned-form-tab-${++nextId}`;
  public sectionContentId = `sky-sectioned-form-section-${++nextId}`;

  /**
   * The section header.
   * @required
   */
  @Input()
  public heading: string | undefined;

  /**
   * The number of items within the section. A counter appears beside the section header.
   */
  @Input()
  public itemCount: number | undefined;

  /**
   * Whether the section is active when the form loads.
   * @default false
   */
  @Input()
  public active: boolean | undefined = false;

  public fieldRequired: boolean | undefined;
  public fieldInvalid: boolean | undefined;

  @ViewChild(SkyVerticalTabComponent)
  public tab: SkyVerticalTabComponent | undefined;

  #ngUnsubscribe = new Subject<void>();

  readonly #sectionedFormService = inject(SkySectionedFormService);
  readonly #tabsetService = inject(SkyVerticalTabsetService);
  readonly #changeRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.#changeRef.detectChanges();

    this.#tabsetService.switchingMobile.subscribe((mobile: boolean) => {
      this.#changeRef.detectChanges();
    });

    this.#sectionedFormService.requiredChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(
        (required: boolean | undefined) => (this.fieldRequired = required),
      );

    this.#sectionedFormService.invalidChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(
        (invalid: boolean | undefined) => (this.fieldInvalid = invalid),
      );
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
