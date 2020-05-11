import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyAffixAutoFitContext
} from './affix-auto-fit-context';

import {
  SkyAffixHorizontalAlignment
} from './affix-horizontal-alignment';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixPlacementChange
} from './affix-placement-change';

import {
  SkyAffixVerticalAlignment
} from './affix-vertical-alignment';

import {
  SkyAffixService
} from './affix.service';

import {
  SkyAffixOffsetChange
} from './affix-offset-change';

import {
  SkyAffixOffset
} from './affix-offset';

import {
  SkyAffixer
} from './affixer';

/**
 * Affixes the host element to a base element.
 */
@Directive({
  selector: '[skyAffixTo]'
})
export class SkyAffixDirective implements OnChanges, OnDestroy {

  /**
   * The base element to affix the host element.
   */
  @Input()
  public skyAffixTo: HTMLElement;

  /**
   * Sets the `autoFitContext` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixAutoFitContext: SkyAffixAutoFitContext;

  /**
   * Sets the `autoFitOverflowOffset` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixAutoFitOverflowOffset: SkyAffixOffset;

  /**
   * Sets the `enableAutoFit` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixEnableAutoFit: boolean;

  /**
   * Sets the `horizontalAlignment` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixHorizontalAlignment: SkyAffixHorizontalAlignment;

  /**
   * Sets the `isSticky` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixIsSticky: boolean;

  /**
   * Sets the `placement` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixPlacement: SkyAffixPlacement;

  /**
   * Sets the `verticalAlignment` property of [[SkyAffixConfig]].
   */
  @Input()
  public affixVerticalAlignment: SkyAffixVerticalAlignment;

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

  private affixer: SkyAffixer;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    elementRef: ElementRef,
    private affixService: SkyAffixService
  ) {
    this.affixer = this.affixService.createAffixer(elementRef);

    this.affixer.offsetChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((change) => this.affixOffsetChange.emit(change));

    this.affixer.overflowScroll
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((change) => this.affixOverflowScroll.emit(change));

    this.affixer.placementChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((change) => this.affixPlacementChange.emit(change));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    /* istanbul ignore else */
    if (
      changes.affixAutoFitContext ||
      changes.affixAutoFitOverflowOffset ||
      changes.affixEnableAutoFit ||
      changes.affixHorizontalAlignment ||
      changes.affixIsSticky ||
      changes.affixPlacement ||
      changes.affixVerticalAlignment
    ) {
      this.updateAlignment();
    }
  }

  public ngOnDestroy(): void {
    this.affixOffsetChange.complete();
    this.affixOverflowScroll.complete();
    this.affixPlacementChange.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.affixer.destroy();
  }

  private updateAlignment(): void {
    this.affixer.affixTo(this.skyAffixTo, {
      autoFitContext: this.affixAutoFitContext,
      autoFitOverflowOffset: this.affixAutoFitOverflowOffset,
      enableAutoFit: this.affixEnableAutoFit,
      horizontalAlignment: this.affixHorizontalAlignment,
      isSticky: this.affixIsSticky,
      placement: this.affixPlacement,
      verticalAlignment: this.affixVerticalAlignment
    });
  }

}
