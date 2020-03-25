import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  SkyAffixAutoFitContext
} from '../affix-auto-fit-context';

import {
  SkyAffixHorizontalAlignment
} from '../affix-horizontal-alignment';

import {
  SkyAffixOffset
} from '../affix-offset';

import {
  SkyAffixPlacement
} from '../affix-placement';

import {
  SkyAffixVerticalAlignment
} from '../affix-vertical-alignment';

import {
  SkyAffixDirective
} from '../affix.directive';

@Component({
  selector: 'affix-test',
  templateUrl: './affix.component.fixture.html',
  styleUrls: ['./affix.component.fixture.scss']
})
export class AffixFixtureComponent {

  // #region directive properties

  public autoFitContext: SkyAffixAutoFitContext;

  public autoFitOverflowOffset: SkyAffixOffset;

  public enableAutoFit: boolean;

  public horizontalAlignment: SkyAffixHorizontalAlignment;

  public isSticky: boolean;

  public placement: SkyAffixPlacement;

  public verticalAlignment: SkyAffixVerticalAlignment;

  // #endregion

  @ViewChild(SkyAffixDirective, {
    read: SkyAffixDirective
  })
  public affixDirective: SkyAffixDirective;

  @ViewChild('affixedRef', {
    read: ElementRef
  })
  public affixedRef: ElementRef;

  @ViewChild('overflowParentRef', {
    read: ElementRef
  })
  public overflowParentRef: ElementRef;

  @ViewChild('baseRef', {
    read: ElementRef
  })
  public baseRef: ElementRef;

  public enableLargerBaseElement: boolean = false;

  public enableOverflowParent: boolean = false;

  public onAffixOffsetChange(): void {}

  public onAffixOverflowScroll(): void {}

  public onAffixPlacementChange(): void { }

  public scrollTargetToLeft(offset: number = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    overflowParent.scrollTop = this.getParentCenterY();
    overflowParent.scrollLeft = baseElement.offsetLeft - offset;
  }

  public scrollTargetToRight(offset: number = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    const baseRect = baseElement.getBoundingClientRect();
    const overflowRect = overflowParent.getBoundingClientRect();

    overflowParent.scrollTop = this.getParentCenterY();
    overflowParent.scrollLeft = (baseElement.offsetLeft + baseRect.width) - overflowParent.offsetLeft - overflowRect.width + offset;
  }

  public scrollTargetToTop(offset: number = 0): void {
    const baseRef = this.baseRef.nativeElement;
    const top = baseRef.offsetTop;
    const overflowParent = this.overflowParentRef.nativeElement;
    overflowParent.scrollTop = top - offset;
    overflowParent.scrollLeft = this.getParentCenterX();
  }

  public scrollTargetToBottom(offset: number = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const top = baseElement.offsetTop;
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    overflowParent.scrollTop = top +
      baseElement.clientHeight -
      overflowParent.getBoundingClientRect().height -
      offset;
    overflowParent.scrollLeft = this.getParentCenterX();
  }

  public scrollTargetOutOfView(): void {
    const parent = this.overflowParentRef.nativeElement;
    parent.scrollTop = 0;
    parent.scrollLeft = 0;
  }

  private getParentCenterX(): number {
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    return baseElement.offsetLeft -
      overflowParent.offsetLeft -
      (overflowParent.getBoundingClientRect().width / 2) +
      (baseElement.getBoundingClientRect().width / 2);
  }

  private getParentCenterY(): number {
    const overflowParent: HTMLDivElement = this.overflowParentRef.nativeElement;
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    return baseElement.offsetTop -
      overflowParent.offsetTop -
      (overflowParent.clientHeight / 2) +
      (baseElement.clientHeight / 2);
  }

}
