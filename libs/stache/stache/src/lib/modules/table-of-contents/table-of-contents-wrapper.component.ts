import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

const HAS_TOC_CLASS_NAME = 'stache-table-of-contents-enabled';

@Component({
  selector: 'stache-table-of-contents-wrapper',
  templateUrl: './table-of-contents-wrapper.component.html',
  styleUrls: ['./table-of-contents-wrapper.component.scss'],
})
export class StacheTableOfContentsWrapperComponent
  implements AfterViewInit, OnDestroy
{
  @Input()
  public tocRoutes: StacheNavLink[];

  constructor(
    private renderer: Renderer2,
    private windowRef: StacheWindowRef
  ) {}

  public ngAfterViewInit(): void {
    this.addClassToBody();
  }

  public ngOnDestroy(): void {
    this.removeClassFromBody();
  }

  private addClassToBody(): void {
    this.renderer.addClass(
      this.windowRef.nativeWindow.document.body,
      HAS_TOC_CLASS_NAME
    );
  }

  private removeClassFromBody(): void {
    this.renderer.removeClass(
      this.windowRef.nativeWindow.document.body,
      HAS_TOC_CLASS_NAME
    );
  }
}
