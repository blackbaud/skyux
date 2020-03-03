import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  SkyAffixHorizontalAlignment
} from '../affix-horizontal-alignment';

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

  @ViewChild('scrollableParentRef', {
    read: ElementRef
  })
  public scrollableParentRef: ElementRef;

  @ViewChild('baseRef', {
    read: ElementRef
  })
  public baseRef: ElementRef;

  public enableScrollableParent: boolean = false;

  public onAffixPlacementChange(): void { }

  public scrollTargetToLeft(offset: number = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const scrollable: HTMLDivElement = this.scrollableParentRef.nativeElement;
    scrollable.scrollTop = this.getParentCenterY();
    scrollable.scrollLeft = baseElement.offsetLeft - offset;
  }

  public scrollTargetToRight(offset: number = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const scrollable: HTMLDivElement = this.scrollableParentRef.nativeElement;
    scrollable.scrollTop = this.getParentCenterY();
    scrollable.scrollLeft = baseElement.offsetLeft - scrollable.clientWidth - offset;
  }

  public scrollTargetToTop(offset: number = 0): void {
    const baseRef: HTMLDivElement = this.baseRef.nativeElement;
    const top = baseRef.offsetTop;
    const scrollable: HTMLDivElement = this.scrollableParentRef.nativeElement;
    scrollable.scrollTop = top - offset;
    scrollable.scrollLeft = this.getParentCenterX();
  }

  public scrollTargetToBottom(offset: number = 0): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const top = baseElement.offsetTop;
    const scrollable: HTMLDivElement = this.scrollableParentRef.nativeElement;
    scrollable.scrollTop = top +
      baseElement.clientHeight -
      scrollable.getBoundingClientRect().height -
      offset;
    scrollable.scrollLeft = this.getParentCenterX();
  }

  public scrollTargetOutOfView(): void {
    const parent = this.scrollableParentRef.nativeElement;
    parent.scrollTop = 0;
    parent.scrollLeft = 0;
  }

  private getParentCenterX(): number {
    const scrollable: HTMLDivElement = this.scrollableParentRef.nativeElement;
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    return baseElement.offsetLeft -
      scrollable.offsetLeft -
      (scrollable.clientWidth / 2) +
      (baseElement.clientWidth / 2);
  }

  private getParentCenterY(): number {
    const scrollable: HTMLDivElement = this.scrollableParentRef.nativeElement;
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    return baseElement.offsetTop -
      scrollable.offsetTop -
      (scrollable.clientHeight / 2) +
      (baseElement.clientHeight / 2);
  }

}
