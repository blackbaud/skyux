import { Component, Renderer2, inject } from '@angular/core';
import {
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { ModalBasicComponent } from './modals/modal-basic.component';
import { ModalTestContext } from './modals/modal-context';

const BANNER_IMAGE_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjM4MCIgdmlld0JveD0iMCAwIDYwMCAzODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMzgwIiBmaWxsPSIjRENGNkY1Ii8+CjxyZWN0IHg9IjQyIiB5PSI0NiIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxNDAiIGZpbGw9IiNERUJERkEiLz4KPHJlY3QgeD0iMjMwIiB5PSIxOTQiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTQwIiByeD0iNzAiIGZpbGw9IiM2MEQ1RDIiLz4KPHBhdGggZD0iTTQ3OCA3OEw1NDcuMjgyIDE5OEg0MDguNzE4TDQ3OCA3OFoiIGZpbGw9IiM2NkUyRkYiLz4KPC9zdmc+Cg==';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false,
})
export class ModalComponent {
  public buttonsHidden = false;
  public showPositionedEl = false;

  #renderer = inject(Renderer2);

  constructor(private modal: SkyModalService) {}

  public hideButtons(): void {
    this.buttonsHidden = true;
  }
  public showButtons(): void {
    this.buttonsHidden = false;
  }

  public onOpenModalClick(): void {
    this.openModal(ModalBasicComponent);
  }

  public onOpenSmallModalClick(): void {
    this.openModal(ModalBasicComponent, { size: 'small' });
  }

  public onOpenMediumModalClick(): void {
    this.openModal(ModalBasicComponent, { size: 'medium' });
  }

  public onOpenLargeModalClick(): void {
    this.openModal(ModalBasicComponent, { size: 'large' });
  }

  public onOpenFullPageModalClick(): void {
    this.openModal(ModalBasicComponent, { fullPage: true });
  }

  public onOpenHelpInlineModalClick(): void {
    const modalInstance = this.openModal(ModalBasicComponent);
    modalInstance.componentInstance.showHelp = true;
  }

  public onOpenErrorModalClick(): void {
    const modalInstance = this.openModal(ModalBasicComponent);
    modalInstance.componentInstance.errors = [
      { message: 'Short error message' },
      {
        message:
          'Long error message that takes up two lines of text. It really does just keep going.',
      },
      { message: 'Additional error message to ensure the max height is hit' },
    ];
  }

  protected onOpenHeadingTextHelpInlineModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useValue: {
            headingText: 'My heading',
            helpPopoverContent: 'My help popover content.',
          } satisfies Partial<ModalTestContext>,
        },
      ],
    });
  }

  protected onOpenModalWithPositionedElClick(): void {
    // This test verifies that absolutely-positioned elements don't disappear
    // when a modal is displayed. Before the fix that accompanies this test,
    // absolutely-positioned elements would be positioned relative to the margins
    // and size of the body element and would be pushed off the screen.
    this.#showPositionedEl();
    this.openModal(ModalBasicComponent, { size: 'medium' });
  }

  protected onOpenHeadingHiddenModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useFactory: (): ModalTestContext => {
            const context = new ModalTestContext();
            context.headingHidden = true;
            context.headingText = 'My heading';
            context.modalContent = 'Modal content';

            return context;
          },
        },
      ],
    });
  }

  protected onOpenBannerContentModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useFactory: (): ModalTestContext => {
            const context = new ModalTestContext();
            context.bannerContent = 'Banner content';
            context.headingHidden = true;
            context.headingText = 'My heading';
            context.modalContent = 'Modal content';

            return context;
          },
        },
      ],
    });
  }

  protected onOpenBannerImageModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useFactory: (): ModalTestContext => {
            const context = new ModalTestContext();
            context.bannerImageSrc = BANNER_IMAGE_SRC;
            context.headingHidden = true;
            context.headingText = 'My heading';
            context.modalContent = 'Modal content';

            return context;
          },
        },
      ],
    });
  }

  protected onOpenBannerContentImageModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useFactory: (): ModalTestContext => {
            const context = new ModalTestContext();
            context.bannerContent = 'Banner content with image';
            context.bannerImageSrc = BANNER_IMAGE_SRC;
            context.headingHidden = true;
            context.headingText = 'My heading';
            context.modalContent = 'Modal content';

            return context;
          },
        },
      ],
    });
  }

  protected onOpenBannerHeadingVisibleModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useFactory: (): ModalTestContext => {
            const context = new ModalTestContext();
            context.bannerImageSrc = BANNER_IMAGE_SRC;
            context.headingText = 'My heading';
            context.modalContent = 'Modal content';

            return context;
          },
        },
      ],
    });
  }

  private openModal(
    modalInstance: any,
    options?: SkyModalConfigurationInterface,
  ): SkyModalInstance {
    this.hideButtons();

    const instance = this.modal.open(modalInstance, options);

    instance.closed.subscribe(() => {
      this.showButtons();
      this.#hidePositionedEl();
    });

    return instance;
  }

  #showPositionedEl(): void {
    this.showPositionedEl = true;
    this.#renderer.addClass(document.body, 'modal-body-margin-test');
  }

  #hidePositionedEl(): void {
    this.showPositionedEl = false;
    this.#renderer.removeClass(document.body, 'modal-body-margin-test');
  }
}
