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
    this.affixer.placementChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((change) => this.affixPlacementChange.emit(change));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    /* istanbul ignore else */
    if (
      changes.affixPlacement ||
      changes.affixHorizontalAlignment ||
      changes.affixVerticalAlignment ||
      changes.affixIsSticky ||
      changes.affixEnableAutoFit
    ) {
      this.updateAlignment();
    }
  }

  public ngOnDestroy(): void {
    this.affixPlacementChange.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.affixer.destroy();
  }

  private updateAlignment(): void {
    this.affixer.affixTo(this.skyAffixTo, {
      enableAutoFit: this.affixEnableAutoFit,
      horizontalAlignment: this.affixHorizontalAlignment,
      isSticky: this.affixIsSticky,
      placement: this.affixPlacement,
      verticalAlignment: this.affixVerticalAlignment
    });
  }

}
