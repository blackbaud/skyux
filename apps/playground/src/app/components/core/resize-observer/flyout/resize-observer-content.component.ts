import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { SkyResizeObserverMediaQueryService } from '@skyux/core';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';
import { SkySectionedFormComponent } from '@skyux/tabs';

import { Subscription } from 'rxjs';

import { ResizeObserverModalComponent } from '../modal/resize-observer-modal.component';

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

  public sizes: ('small' | 'medium' | 'large' | 'default')[] = [
    'small',
    'medium',
    'large',
    'default',
  ];

  private subscriptions = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private skyResizeObserverMediaQueryService: SkyResizeObserverMediaQueryService,
    private modalService: SkyModalService
  ) {}

  public ngAfterViewInit(): void {
    this.skyResizeObserverMediaQueryService.observe(this.elementRef);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent.showTabs();
  }

  public onOpenModalClick(
    size: 'small' | 'medium' | 'large' | 'default',
    variation: 'responsive' | 'plain' = 'responsive'
  ): void {
    const modalInstanceType = ResizeObserverModalComponent;
    const options: SkyModalConfigurationInterface = {
      size,
      providers: [
        {
          provide: 'size',
          useValue: size,
        },
        {
          provide: 'variation',
          useValue: variation,
        },
      ],
    };

    this.modalService.open(modalInstanceType, options);
  }
}
