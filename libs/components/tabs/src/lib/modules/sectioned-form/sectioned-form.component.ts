import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { SkyTabIdService } from '../shared/tab-id.service';

import { SkyVerticalTabsetService } from './../vertical-tabset/vertical-tabset.service';
import { SkySectionedFormMessage } from './types/sectioned-form-message';
import { SkySectionedFormMessageType } from './types/sectioned-form-message-type';

/**
 * The default width of the tabs pane. Also serves as the maximum width of the
 * pane for any `tabWidth` value.
 */
const DEFAULT_TAB_WIDTH = '30%';

/**
 * Creates a container for the sectioned forms.
 */
@Component({
  selector: 'sky-sectioned-form',
  templateUrl: './sectioned-form.component.html',
  styleUrls: ['./sectioned-form.component.scss'],
  providers: [SkyTabIdService, SkyVerticalTabsetService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkySectionedFormComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  /**
   * Whether the sectioned form loads section content during initialization so that it
   * displays content without moving around elements in the content container.
   * @default false
   */
  @Input()
  public maintainSectionContent: boolean | undefined = false;

  /**
   * The width of the tabs pane as a CSS width value (such as `200px`, `15rem`,
   * or `20%`). Set to `"auto"` to size based on tab label content. Maximum
   * width is 30%.
   * @default "30%"
   */
  public readonly tabWidth = input(DEFAULT_TAB_WIDTH, {
    transform: (value: string | undefined): string =>
      value?.trim() || DEFAULT_TAB_WIDTH,
  });

  @Input()
  public set messageStream(
    value: Subject<SkySectionedFormMessage> | undefined,
  ) {
    this.#_messageStream = value || new Subject<SkySectionedFormMessage>();
    this.#initMessageStream();
  }

  public get messageStream(): Subject<SkySectionedFormMessage> {
    return this.#_messageStream;
  }

  /**
   * Fires when the active tab changes and emits the index of the active
   * section. The index is based on the section's position when the form loads.
   */
  @Output()
  public indexChanged = new EventEmitter<number>();

  /**
   * Fires when the sectioned form tabs are shown or hidden.
   */
  @Output()
  public tabsVisibleChanged = new EventEmitter<boolean>();

  public ariaOwns: string | undefined;

  public ariaRole: string | undefined = 'tablist';

  @ViewChild('skySectionSideContent')
  public content: ElementRef | undefined;

  #ngUnsubscribe = new Subject<void>();

  #messageStreamSub: Subscription | undefined;
  readonly #changeRef = inject(ChangeDetectorRef);
  readonly #tabIdSvc = inject(SkyTabIdService);
  readonly #logger = inject(SkyLogService);

  #_messageStream = new Subject<SkySectionedFormMessage>();

  protected animationEnabled = signal(false);

  protected readonly isMobile = signal(false);

  public readonly tabService = inject(SkyVerticalTabsetService);

  constructor() {
    // Enable animations after the first render.
    afterNextRender(() => {
      this.animationEnabled.set(true);
    });

    this.#initMessageStream();

    this.#tabIdSvc.ids.pipe(takeUntil(this.#ngUnsubscribe)).subscribe((ids) => {
      this.ariaOwns = ids.join(' ') || undefined;
      this.#changeRef.markForCheck();
    });
  }

  public ngOnInit(): void {
    this.tabService.maintainTabContent = this.maintainSectionContent;

    this.tabService.indexChanged
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((index) => {
        this.indexChanged.emit(index);
        this.#changeRef.markForCheck();
      });

    this.tabService.switchingMobile
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        if (!mobile) {
          this.ariaRole = 'tablist';
        } else {
          this.ariaRole = undefined;
        }

        this.isMobile.set(mobile);
        this.#changeRef.markForCheck();
      });

    this.tabService.hidingTabs
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.tabsVisibleChanged.emit(false);
      });

    this.tabService.showingTabs
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.tabsVisibleChanged.emit(true);
      });

    if (this.tabService.isMobile()) {
      this.ariaRole = undefined;
      this.isMobile.set(true);
      this.#changeRef.markForCheck();
    }
  }

  public ngAfterViewChecked(): void {
    this.tabService.content = this.content;
    this.tabService.updateContent();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * @deprecated Use the `tabsVisibleChanged` output to listen for tab visibility changes.
   */
  /* istanbul ignore next */
  public tabsVisible(): boolean {
    this.#logger.deprecated('SectionedFormComponent.tabsVisible()', {
      deprecationMajorVersion: 8,
      moreInfoUrl:
        'https://developer.blackbaud.com/skyux/components/sectioned-form',
      replacementRecommendation:
        'Use the `tabsVisibleChanged` output to listen for tab visibility changes.',
    });

    this.#changeRef.markForCheck();
    return this.tabService.tabsVisible();
  }

  /**
   * @deprecated Use the `messageStream` input and push a `ShowTabs` message to the message stream instead.
   */
  public showTabs(): void {
    this.#logger.deprecated('SectionedFormComponent.showTabs()', {
      deprecationMajorVersion: 8,
      moreInfoUrl:
        'https://developer.blackbaud.com/skyux/components/sectioned-form',
      replacementRecommendation:
        'Use the `messageStream` input and push a `ShowTabs` message to the message stream instead.',
    });

    this.#showTabs();
  }

  #showTabs(): void {
    this.tabService.showTabs();
    this.#changeRef.markForCheck();
  }

  #initMessageStream(): void {
    if (this.#messageStreamSub) {
      this.#messageStreamSub.unsubscribe();
    }

    this.#messageStreamSub = this.messageStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message) => {
        switch (message.type) {
          case SkySectionedFormMessageType.ShowTabs:
            this.#showTabs();
            break;
        }
      });
  }

  protected readonly tabsFlexBasis = computed<string | undefined>(() =>
    this.isMobile() ? undefined : this.tabWidth(),
  );

  protected readonly tabsMaxWidth = computed<string | undefined>(() =>
    this.isMobile() ? undefined : DEFAULT_TAB_WIDTH,
  );
}
