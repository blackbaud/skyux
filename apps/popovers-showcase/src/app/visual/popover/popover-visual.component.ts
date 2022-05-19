import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  λ5 as SkyPopoverContentComponent,
  λ8 as SkyPopoverContext,
} from '@skyux/popovers';
import { SkyPopoverAlignment, SkyPopoverPlacement } from '@skyux/popovers';

@Component({
  selector: 'app-popover-visual',
  templateUrl: './popover-visual.component.html',
  styleUrls: ['./popover-visual.component.scss'],
})
export class PopoverVisualComponent implements AfterViewInit {
  @ViewChild('staticPopoversTarget', {
    read: ViewContainerRef,
  })
  private staticPopoversTarget: ViewContainerRef;

  @ViewChild('staticDangerPopoversTarget', {
    read: ViewContainerRef,
  })
  private staticDangerPopoversTarget: ViewContainerRef;

  @ViewChild('staticPopoverContentRef', { read: TemplateRef })
  private staticPopoverContentRef: TemplateRef<unknown>;

  public popoverType = new FormControl('info');

  constructor(private elementRef: ElementRef, private injector: Injector) {}

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.createStaticPopovers();
    });
  }

  /**
   * Creates "static" popover content for the visual tests only.
   */
  private createStaticPopovers(): void {
    const configs: {
      horizontalAlignment: SkyPopoverAlignment;
      placement: SkyPopoverPlacement;
      popoverTitle: string;
    }[] = [
      {
        horizontalAlignment: 'center',
        placement: 'above',
        popoverTitle: undefined,
      },
      {
        horizontalAlignment: 'center',
        placement: 'below',
        popoverTitle: undefined,
      },
      {
        horizontalAlignment: 'center',
        placement: 'right',
        popoverTitle: undefined,
      },
      {
        horizontalAlignment: 'center',
        placement: 'left',
        popoverTitle: undefined,
      },
      {
        horizontalAlignment: 'center',
        placement: 'above',
        popoverTitle: undefined,
      },
      {
        horizontalAlignment: 'center',
        placement: 'above',
        popoverTitle: 'Did you know?',
      },
      {
        horizontalAlignment: 'center',
        placement: 'below',
        popoverTitle: 'Did you know?',
      },
      {
        horizontalAlignment: 'center',
        placement: 'right',
        popoverTitle: 'Did you know?',
      },
      {
        horizontalAlignment: 'center',
        placement: 'left',
        popoverTitle: 'Did you know?',
      },
    ];

    const injector = Injector.create({
      providers: [
        {
          provide: SkyPopoverContext,
          useValue: new SkyPopoverContext({
            contentTemplateRef: this.staticPopoverContentRef,
          }),
        },
      ],
      parent: this.injector,
    });

    configs.forEach((config) => {
      const componentRef = this.staticPopoversTarget.createComponent(
        SkyPopoverContentComponent,
        { injector }
      );

      componentRef.instance.open(this.elementRef, {
        dismissOnBlur: false,
        enableAnimations: false,
        horizontalAlignment: config.horizontalAlignment,
        isStatic: true,
        placement: config.placement,
        popoverTitle: config.popoverTitle,
        popoverType: 'info',
      });
    });

    configs.forEach((config) => {
      const componentRef = this.staticDangerPopoversTarget.createComponent(
        SkyPopoverContentComponent,
        { injector }
      );

      componentRef.instance.open(this.elementRef, {
        dismissOnBlur: false,
        enableAnimations: false,
        horizontalAlignment: config.horizontalAlignment,
        isStatic: true,
        placement: config.placement,
        popoverTitle: config.popoverTitle,
        popoverType: 'danger',
      });
    });
  }
}
