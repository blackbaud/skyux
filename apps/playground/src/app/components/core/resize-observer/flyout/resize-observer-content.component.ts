import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { SkyResizeObserverMediaQueryService } from '@skyux/core';
import { SkySectionedFormComponent } from '@skyux/tabs';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resize-observer-content',
  templateUrl: './resize-observer-content.component.html',
  styleUrls: ['./resize-observer-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeObserverContentComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent | undefined;

  private subscriptions = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private skyResizeObserverMediaQueryService: SkyResizeObserverMediaQueryService
  ) {}

  public ngAfterViewInit(): void {
    this.skyResizeObserverMediaQueryService.observe(this.elementRef);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.skyResizeObserverMediaQueryService.destroy();
  }

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent.showTabs();
  }
}
