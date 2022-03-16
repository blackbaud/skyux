import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { StacheNavLink } from '../nav/nav-link';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheLayout } from './layout';

@Component({
  selector: 'stache-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class StacheLayoutComponent implements OnInit, OnChanges, StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public layoutType = 'sidebar';

  @Input()
  public inPageRoutes: StacheNavLink[];

  @Input()
  public showTableOfContents: boolean;

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public showBreadcrumbs: boolean;

  @Input()
  public showEditButton: boolean;

  @Input()
  public showBackToTop: boolean;

  public templateRef: any;

  @ViewChild('blankLayout', {
    static: true,
  })
  private blankTemplateRef: any;

  @ViewChild('containerLayout', {
    static: true,
  })
  private containerTemplateRef: any;

  @ViewChild('sidebarLayout', {
    static: true,
  })
  private sidebarTemplateRef: any;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private windowRef: StacheWindowRef
  ) {}

  public ngOnInit(): void {
    switch (this.layoutType) {
      case 'blank':
        this.templateRef = this.blankTemplateRef;
        break;
      case 'sidebar':
        this.templateRef = this.sidebarTemplateRef;
        break;
      default:
        this.templateRef = this.containerTemplateRef;
        break;
    }
  }

  public ngOnChanges(): void {
    // Reset the wrapper height whenever there are changes.
    this.windowRef.nativeWindow.setTimeout(() => {
      this.setMinHeight();
    });
  }

  private setMinHeight() {
    const wrapper = this.elementRef.nativeElement.querySelector(
      '.stache-layout-wrapper'
    );
    const minHeight =
      this.windowRef.nativeWindow.innerHeight -
      wrapper.getBoundingClientRect().top;
    this.renderer.setStyle(wrapper, 'min-height', `${minHeight}px`);
  }
}
