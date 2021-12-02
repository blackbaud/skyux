import { Component, ElementRef, ViewChild } from '@angular/core';

import { SkyMediaBreakpoints } from '../../media-query/media-breakpoints';

import { SkyCoreAdapterService } from '../adapter.service';

import { SkyFocusableChildrenOptions } from '../focusable-children-options';

@Component({
  selector: 'sky-adapter-service-fixture',
  templateUrl: './adapter-service.fixture.html',
})
export class AdapterServiceFixtureComponent {
  @ViewChild('getWidthContainer', {
    read: ElementRef,
    static: false,
  })
  public getWidthContainer: ElementRef;

  @ViewChild('paragraphContainer', {
    read: ElementRef,
    static: false,
  })
  public paragraphContainer: ElementRef;

  @ViewChild('syncHeightContainer', {
    read: ElementRef,
    static: false,
  })
  public syncHeightContainer: ElementRef;

  public disableInput: boolean = false;

  constructor(private adapterService: SkyCoreAdapterService) {}

  public applyAutoFocus(elementRef: ElementRef): boolean {
    return this.adapterService.applyAutoFocus(elementRef);
  }

  public toggleIframePointerEvents(enable: boolean): void {
    this.adapterService.toggleIframePointerEvents(enable);
  }

  public getFocusableChildrenAndApplyFocus(
    element: ElementRef,
    containerSelector: string,
    focusOnContainerIfNotFound?: boolean
  ): void {
    return this.adapterService.getFocusableChildrenAndApplyFocus(
      element,
      containerSelector,
      focusOnContainerIfNotFound
    );
  }

  public getFocusableChildren(
    element: HTMLElement,
    options?: SkyFocusableChildrenOptions
  ): any[] {
    return this.adapterService.getFocusableChildren(element, options);
  }

  public getWidth(): number {
    return this.adapterService.getWidth(this.getWidthContainer);
  }

  public resetHeight(): void {
    this.adapterService.resetHeight(this.syncHeightContainer, 'div');
  }

  public syncHeight(): void {
    this.adapterService.syncMaxHeight(this.syncHeightContainer, 'div');
  }

  public setParagraphContainerClass(breakpoint: SkyMediaBreakpoints): void {
    this.adapterService.setResponsiveContainerClass(
      this.paragraphContainer,
      breakpoint
    );
  }
}
