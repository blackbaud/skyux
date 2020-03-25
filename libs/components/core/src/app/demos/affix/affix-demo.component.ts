import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  SkyAffixAutoFitContext,
  SkyAffixHorizontalAlignment,
  SkyAffixOffset,
  SkyAffixPlacement,
  SkyAffixPlacementChange,
  SkyAffixVerticalAlignment
} from '../../public';

@Component({
  selector: 'app-affix-demo',
  templateUrl: './affix-demo.component.html',
  styleUrls: ['./affix-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffixDemoComponent {

  public get overflowParentWidth(): string {
    if (this.enableOverflowParent) {
      return `${this.parentOverflowRef.nativeElement.scrollWidth}px`;
    }

    return `${document.body.scrollWidth}px`;
  }

  public autoFitContexts: SkyAffixAutoFitContext[] = [
    SkyAffixAutoFitContext.OverflowParent,
    SkyAffixAutoFitContext.Viewport
  ];

  public autoFitOverflowOffset: SkyAffixOffset;

  public disabled: boolean = false;

  public enableAutoFit: boolean = true;

  public enableFullWidthBaseElement: boolean = false;

  public enableLargeBaseElement: boolean = false;

  public enableOverflowParent: boolean = false;

  public enableSmallerParent: boolean = false;

  public horizontalAlignments: SkyAffixHorizontalAlignment[] = [
    'right',
    'center',
    'left'
  ];

  public isSticky: boolean = true;

  public isVisible: boolean = false;

  public model: {
    autoFitContext: SkyAffixAutoFitContext;
    placement: SkyAffixPlacement;
    horizontalAlignment?: SkyAffixHorizontalAlignment;
    verticalAlignment?: SkyAffixVerticalAlignment;
  } = {
    autoFitContext: SkyAffixAutoFitContext.OverflowParent,
    placement: 'above',
    horizontalAlignment: 'center',
    verticalAlignment: 'middle'
  };

  public placements: SkyAffixPlacement[] = [
    'above',
    'right',
    'below',
    'left'
  ];

  public verticalAlignments: SkyAffixVerticalAlignment[] = [
    'bottom',
    'middle',
    'top'
  ];

  @ViewChild('baseRef', { read: ElementRef })
  private baseRef: ElementRef;

  @ViewChild('parentOverflowRef', { read: ElementRef })
  private parentOverflowRef: ElementRef;

  @ViewChild('toolbarRef', { read: ElementRef })
  private toolbarRef: ElementRef;

  private horizontalAlignmentIndex = 0;

  private interval: any;

  private placementIndex = 0;

  private verticalAlignmentIndex = 0;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public onAffixPlacementChange(change: SkyAffixPlacementChange): void {
    this.isVisible = (change.placement !== null);
    this.changeDetector.detectChanges();
  }

  public scrollToBaseElement(): void {
    const baseElement: HTMLDivElement = this.baseRef.nativeElement;
    const top = baseElement.offsetTop;
    const left = baseElement.offsetLeft;

    if (this.enableOverflowParent) {
      const overflowParent: HTMLDivElement = this.parentOverflowRef.nativeElement;
      overflowParent.scrollTop = top -
        overflowParent.offsetTop -
        (overflowParent.clientHeight / 2) +
        (baseElement.clientHeight / 2);
      overflowParent.scrollLeft = left -
        overflowParent.offsetLeft -
        (overflowParent.clientWidth / 2) +
        (baseElement.clientWidth / 2);
    } else {
      window.scroll(
        left -
          (document.documentElement.clientWidth / 2) +
          (baseElement.clientWidth / 2),
        top -
          (document.documentElement.clientHeight / 2) +
          (baseElement.clientHeight / 2) +
          (this.toolbarRef.nativeElement.clientHeight / 2)
      );
    }
  }

  public stepAffixCycle(): void {
    this.goToNext();
  }

  public runAffixCycle(): void {
    if (this.interval) {
      return;
    }

    this.disabled = true;
    this.placementIndex = 0;
    this.horizontalAlignmentIndex = 0;
    this.verticalAlignmentIndex = 0;
    this.changeDetector.markForCheck();

    this.interval = setInterval(() => {
      if (this.placementIndex === this.placements.length) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.disabled = false;
        this.changeDetector.markForCheck();
        return;
      }

      this.goToNext();
    }, 250);
  }

  public toggleOverflowParent(): void {
    this.enableOverflowParent = !this.enableOverflowParent;
    this.model.placement = 'below';
    this.changeDetector.markForCheck();
    setTimeout(() => this.scrollToBaseElement());
  }

  public toggleSmallerParent(): void {
    this.enableSmallerParent = !this.enableSmallerParent;
    this.changeDetector.markForCheck();
    setTimeout(() => this.scrollToBaseElement());
  }

  public toggleAutoFitOverflowOffset(): void {
    if (this.autoFitOverflowOffset) {
      this.autoFitOverflowOffset = undefined;
    } else {
      this.autoFitOverflowOffset = {
        top: 50, // Omnibar
        bottom: this.toolbarRef.nativeElement.getBoundingClientRect().height
      };
    }
    this.changeDetector.markForCheck();
  }

  public getAutoFitContextForDisplay(context: SkyAffixAutoFitContext): string {
    return (context === SkyAffixAutoFitContext.OverflowParent)
      ? 'OverflowParent'
      : 'Viewport';
  }

  private goToNext(): void {
    if (this.placementIndex >= this.placements.length) {
      this.placementIndex = 0;
    }

    const placement = this.placements[this.placementIndex];
    this.model.placement = placement;
    this.changeDetector.markForCheck();

    if (placement === 'above' || placement === 'below') {
      this.model.horizontalAlignment = this.horizontalAlignments[this.horizontalAlignmentIndex];
      this.horizontalAlignmentIndex++;
      if (this.horizontalAlignmentIndex === this.horizontalAlignments.length) {
        this.placementIndex++;
        this.horizontalAlignmentIndex = 0;
        this.horizontalAlignments.reverse();
      }
    } else {
      this.model.verticalAlignment = this.verticalAlignments[this.verticalAlignmentIndex];
      this.verticalAlignmentIndex++;
      if (this.verticalAlignmentIndex === this.verticalAlignments.length) {
        this.placementIndex++;
        this.verticalAlignmentIndex = 0;
        this.verticalAlignments.reverse();
      }
    }

    this.changeDetector.markForCheck();
  }

}
