import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAffixAutoFitContext } from './affix-auto-fit-context';
import { SkyAffixHorizontalAlignment } from './affix-horizontal-alignment';
import { SkyAffixOffset } from './affix-offset';
import { SkyAffixOffsetChange } from './affix-offset-change';
import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixPlacementChange } from './affix-placement-change';
import { SkyAffixPosition } from './affix-position';
import { SkyAffixVerticalAlignment } from './affix-vertical-alignment';
import { SkyAffixService } from './affix.service';
import { SkyAffixer } from './affixer';

/**
 * Affixes the host element to a base element.
 */
@Directive({
  selector: '[skyAffixTo]',
  standalone: false,
})
export class SkyAffixDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * The base element to affix the host element.
   */
  @Input()
  public skyAffixTo: HTMLElement | undefined;

  /**
   * Sets the `autoFitContext` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixAutoFitContext: SkyAffixAutoFitContext | undefined;

  /**
   * Sets the `autoFitOverflowOffset` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixAutoFitOverflowOffset: SkyAffixOffset | undefined;

  /**
   * Sets the `enableAutoFit` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixEnableAutoFit: boolean | undefined;

  /**
   * Sets the `horizontalAlignment` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixHorizontalAlignment: SkyAffixHorizontalAlignment | undefined;

  /**
   * Sets the `isSticky` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixIsSticky: boolean | undefined;

  /**
   * Sets the `placement` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixPlacement: SkyAffixPlacement | undefined;

  /**
   * Sets the `position` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixPosition: SkyAffixPosition | undefined;

  /**
   * Sets the `verticalAlignment` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixVerticalAlignment: SkyAffixVerticalAlignment | undefined;

  /**
   * Fires when the affixed element's offset changes.
   */
  @Output()
  public affixOffsetChange = new EventEmitter<SkyAffixOffsetChange>();

  /**
   * Fires when the affixed element's overflow container is scrolled.
   */
  @Output()
  public affixOverflowScroll = new EventEmitter<void>();

  /**
   * Fires when the placement value changes.
   */
  @Output()
  public affixPlacementChange = new EventEmitter<SkyAffixPlacementChange>();

  #affixer: SkyAffixer | undefined;

  #affixService: SkyAffixService;

  #elementRef: ElementRef;

  #ngUnsubscribe = new Subject<void>();

  constructor(elementRef: ElementRef, affixService: SkyAffixService) {
    this.#elementRef = elementRef;
    this.#affixService = affixService;
  }

  public ngOnInit(): void {
    this.#affixer = this.#affixService.createAffixer(this.#elementRef);

    this.#affixer.offsetChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((change) => this.affixOffsetChange.emit(change));

    this.#affixer.overflowScroll
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((change) => this.affixOverflowScroll.emit(change));

    this.#affixer.placementChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((change) => this.affixPlacementChange.emit(change));

    this.#updateAlignment();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    /* istanbul ignore else */
    if (
      changes['affixAutoFitContext'] ||
      changes['affixAutoFitOverflowOffset'] ||
      changes['affixEnableAutoFit'] ||
      changes['affixHorizontalAlignment'] ||
      changes['affixIsSticky'] ||
      changes['affixPlacement'] ||
      changes['affixPosition'] ||
      changes['affixVerticalAlignment']
    ) {
      this.#updateAlignment();
    }
  }

  public ngOnDestroy(): void {
    this.affixOffsetChange.complete();
    this.affixOverflowScroll.complete();
    this.affixPlacementChange.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    /*istanbul ignore else*/
    if (this.#affixer) {
      this.#affixer.destroy();
      this.#affixer = undefined;
    }
  }

  #updateAlignment(): void {
    if (this.skyAffixTo && this.#affixer) {
      this.#affixer.affixTo(this.skyAffixTo, {
        autoFitContext: this.affixAutoFitContext,
        autoFitOverflowOffset: this.affixAutoFitOverflowOffset,
        enableAutoFit: this.affixEnableAutoFit,
        horizontalAlignment: this.affixHorizontalAlignment,
        isSticky: this.affixIsSticky,
        placement: this.affixPlacement,
        position: this.affixPosition,
        verticalAlignment: this.affixVerticalAlignment,
      });
    }
  }
}
