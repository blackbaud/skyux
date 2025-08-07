import { Component, ElementRef, ViewChild } from '@angular/core';

import { SkyAffixAutoFitContext } from '../affix-auto-fit-context';
import { SkyAffixHorizontalAlignment } from '../affix-horizontal-alignment';
import { SkyAffixOffset } from '../affix-offset';
import { SkyAffixPlacement } from '../affix-placement';
import { SkyAffixPlacementChange } from '../affix-placement-change';
import { SkyAffixPosition } from '../affix-position';
import { SkyAffixVerticalAlignment } from '../affix-vertical-alignment';
import { SkyAffixDirective } from '../affix.directive';

@Component({
  selector: 'sky-affix-test',
  templateUrl: './affix.component.fixture.html',
  styleUrls: ['./affix.component.fixture.scss'],
  standalone: false,
})
export class AffixFixtureComponent {
  // #region directive properties

  public autoFitContext: SkyAffixAutoFitContext | undefined;

  public autoFitOverflowOffset: SkyAffixOffset | undefined;

  public enableAutoFit: boolean | undefined;

  public horizontalAlignment: SkyAffixHorizontalAlignment | undefined;

  public isSticky: boolean | undefined;

  public placement: SkyAffixPlacement | undefined;

  public verticalAlignment: SkyAffixVerticalAlignment | undefined;

  public position: SkyAffixPosition | undefined;

  // #endregion

  @ViewChild(SkyAffixDirective, {
    read: SkyAffixDirective,
    static: true,
  })
  public affixDirective!: SkyAffixDirective;

  @ViewChild('affixedRef', {
    read: ElementRef,
    static: true,
  })
  public affixedRef!: ElementRef;

  @ViewChild('overflowParentRef', {
    read: ElementRef,
    static: true,
  })
  public overflowParentRef!: ElementRef;

  @ViewChild('baseRef', {
    read: ElementRef,
    static: true,
  })
  public baseRef!: ElementRef;

  public enableLargerBaseElement = false;

  public enableOverflowParent = false;

  public enablePositionedParent = false;

  public onAffixOffsetChange(): void {}

  public onAffixOverflowScroll(): void {}

  public onAffixPlacementChange(change: SkyAffixPlacementChange): void {}

  public scrollTargetToLeft(offset = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    overflowParent.scrollTop = this.#getParentCenterY();
    overflowParent.scrollLeft = baseElement.offsetLeft - offset;
  }

  public scrollTargetToRight(offset = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    const baseRect = baseElement.getBoundingClientRect();
    const overflowRect = overflowParent.getBoundingClientRect();

    overflowParent.scrollTop = this.#getParentCenterY();
    overflowParent.scrollLeft =
      baseElement.offsetLeft +
      baseRect.width -
      overflowParent.offsetLeft -
      overflowRect.width +
      offset;
  }

  public scrollTargetToTop(offset = 0): void {
    const baseRef = this.baseRef.nativeElement;
    const top = baseRef.offsetTop;
    const overflowParent = this.overflowParentRef.nativeElement;
    overflowParent.scrollTop = top - offset;
    overflowParent.scrollLeft = this.#getParentCenterX();
  }

  public scrollTargetToBottom(offset = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const top = baseElement.offsetTop;
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    overflowParent.scrollTop =
      top +
      baseElement.clientHeight -
      overflowParent.getBoundingClientRect().height -
      offset;
    overflowParent.scrollLeft = this.#getParentCenterX();
  }

  public scrollTargetIntoView(): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const top = baseElement.offsetTop;
    const left = baseElement.offsetLeft;

    if (this.enableOverflowParent) {
      const overflowParent: HTMLDivElement =
        this.overflowParentRef.nativeElement;
      overflowParent.scrollTop =
        top -
        overflowParent.offsetTop -
        overflowParent.clientHeight / 2 +
        baseElement.clientHeight / 2;
      overflowParent.scrollLeft =
        left -
        overflowParent.offsetLeft -
        overflowParent.clientWidth / 2 +
        baseElement.clientWidth / 2;
    } else {
      window.scroll(
        left -
          document.documentElement.clientWidth / 2 +
          baseElement.clientWidth / 2,
        top -
          document.documentElement.clientHeight / 2 +
          baseElement.clientHeight / 2,
      );
    }
  }

  public scrollTargetOutOfView(): void {
    const parent = this.overflowParentRef.nativeElement;
    parent.scrollTop = 0;
    parent.scrollLeft = 0;
  }

  #getParentCenterX(): number {
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    return (
      baseElement.offsetLeft -
      overflowParent.offsetLeft -
      overflowParent.getBoundingClientRect().width / 2 +
      baseElement.getBoundingClientRect().width / 2
    );
  }

  #getParentCenterY(): number {
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    return (
      baseElement.offsetTop -
      overflowParent.offsetTop -
      overflowParent.clientHeight / 2 +
      baseElement.clientHeight / 2
    );
  }
}
