import { Component, ElementRef, ViewChild } from '@angular/core';

import { SkyMediaBreakpoints } from '../../media-query/media-breakpoints';
import { SkyCoreAdapterService } from '../adapter.service';
import { SkyFocusableChildrenOptions } from '../focusable-children-options';

@Component({
  selector: 'sky-adapter-service-fixture',
  templateUrl: './adapter-service.fixture.html',
  standalone: false,
})
export class AdapterServiceFixtureComponent {
  @ViewChild('getWidthContainer', {
    read: ElementRef,
    static: false,
  })
  public getWidthContainer!: ElementRef;

  @ViewChild('paragraphContainer', {
    read: ElementRef,
    static: false,
  })
  public paragraphContainer!: ElementRef;

  @ViewChild('syncHeightContainer', {
    read: ElementRef,
    static: false,
  })
  public syncHeightContainer!: ElementRef;

  public disableInput = false;

  #adapterSvc: SkyCoreAdapterService;

  constructor(adapterSvc: SkyCoreAdapterService) {
    this.#adapterSvc = adapterSvc;
  }

  public applyAutoFocus(elementRef?: ElementRef): boolean {
    return this.#adapterSvc.applyAutoFocus(elementRef);
  }

  public toggleIframePointerEvents(enable: boolean): void {
    this.#adapterSvc.toggleIframePointerEvents(enable);
  }

  public getFocusableChildrenAndApplyFocus(
    element: ElementRef,
    containerSelector?: string,
    focusOnContainerIfNotFound?: boolean,
  ): void {
    return this.#adapterSvc.getFocusableChildrenAndApplyFocus(
      element,
      containerSelector,
      focusOnContainerIfNotFound,
    );
  }

  public getFocusableChildren(
    element?: HTMLElement,
    options?: SkyFocusableChildrenOptions,
  ): any[] {
    return this.#adapterSvc.getFocusableChildren(element, options);
  }

  public getWidth(): number {
    return this.#adapterSvc.getWidth(this.getWidthContainer);
  }

  public resetHeight(): void {
    this.#adapterSvc.resetHeight(this.syncHeightContainer, 'div');
  }

  public syncHeight(): void {
    this.#adapterSvc.syncMaxHeight(this.syncHeightContainer, 'div');
  }

  public setParagraphContainerClass(breakpoint: SkyMediaBreakpoints): void {
    this.#adapterSvc.setResponsiveContainerClass(
      this.paragraphContainer,
      breakpoint,
    );
  }
}
