import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { SkyModalInstance } from '@skyux/modals';
import { SkySectionedFormComponent } from '@skyux/tabs';

@Component({
  selector: 'app-resize-observer-modal',
  templateUrl: './resize-observer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeObserverModalComponent implements AfterViewInit, OnInit {
  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent;

  public breakpoint = '(breakpoint not set)';

  public tabsHidden = false;

  constructor(
    public instance: SkyModalInstance,
    public changeDetectorRef: ChangeDetectorRef,
    public mediaQueryService: SkyMediaQueryService,
    public injector: Injector
  ) {}

  public ngOnInit(): void {
    this.mediaQueryService.subscribe((breakpoint) => {
      switch (breakpoint) {
        case SkyMediaBreakpoints.xs:
          this.breakpoint = 'SkyMediaBreakpoints.xs';
          break;
        case SkyMediaBreakpoints.sm:
          this.breakpoint = 'SkyMediaBreakpoints.sm';
          break;
        case SkyMediaBreakpoints.md:
          this.breakpoint = 'SkyMediaBreakpoints.md';
          break;
        case SkyMediaBreakpoints.lg:
          this.breakpoint = 'SkyMediaBreakpoints.lg';
          break;
        default:
          this.breakpoint = `(other breakpoint: ${JSON.stringify(breakpoint)})`;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  public ngAfterViewInit(): void {
    this.tabsHidden = !this.sectionedFormComponent.tabsVisible();
    if (this.tabsHidden) {
      this.changeDetectorRef.markForCheck();
    }
  }

  public showTabs(): void {
    this.sectionedFormComponent.showTabs();
  }
}
