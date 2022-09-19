import { Component } from '@angular/core';
import {
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { ModalCloseConfirmComponent } from './modal-close-confirm.component';
import { ModalContentAutofocusComponent } from './modal-content-autofocus.component';
import { ModalContentDemoComponent } from './modal-content-demo.component';
import { ModalDemoComponent } from './modal-demo.component';
import { ModalFormDemoComponent } from './modal-form-demo.component';
import { ModalFullPageDemoComponent } from './modal-fullpage-demo.component';
import { ModalLargeDemoComponent } from './modal-large-demo.component';
import { ModalTiledDemoComponent } from './modal-tiled-demo.component';

@Component({
  selector: 'app-modal-visual',
  templateUrl: './modal-visual.component.html',
  styleUrls: ['./modal-visual.component.scss'],
})
export class ModalVisualComponent {
  public showHelp = false;
  public buttonsHidden: boolean;

  constructor(private modal: SkyModalService) {}

  public openModal(): void {
    this.openModalInstance(ModalDemoComponent, { providers: [] });
  }

  public openModalWithHelp(): void {
    this.openModalInstance(ModalDemoComponent, {
      providers: [],
      helpKey: 'demo-key.html',
    });
  }

  public openModalWithExtendedTitle(): void {
    const instance = this.openModalInstance(ModalDemoComponent, {
      providers: [],
      helpKey: 'demo-key.html',
    });
    instance.componentInstance.title =
      'This is a modal title with an extended header text that must wrap by default';
  }

  public openLargeModal(): void {
    this.openModalInstance(ModalLargeDemoComponent, { providers: [] });
  }

  public openFullScreenModal(): void {
    this.openModalInstance(ModalFullPageDemoComponent, {
      providers: [],
      fullPage: true,
    });
  }

  public openContentModal(): void {
    this.openModalInstance(ModalContentDemoComponent);
  }

  public openSmallSizeModal(): void {
    this.openModalInstance(ModalDemoComponent, {
      providers: [],
      fullPage: false,
      size: 'small',
    });
  }

  public openMediumSizeModal(): void {
    this.openModalInstance(ModalDemoComponent, {
      providers: [],
      fullPage: false,
      size: 'medium',
    });
  }

  public openLargeSizeModal(): void {
    this.openModalInstance(ModalDemoComponent, {
      providers: [],
      fullPage: false,
      size: 'large',
    });
  }

  public openTiledModal(): void {
    this.openModalInstance(ModalTiledDemoComponent, { providers: [] });
  }

  public openAutofocusModal(): void {
    this.openModalInstance(ModalContentAutofocusComponent, {
      providers: [],
      fullPage: false,
      size: 'large',
    });
  }

  public openCloseConfirmationModal(): void {
    this.openModalInstance(ModalCloseConfirmComponent, {
      providers: [],
      fullPage: false,
      size: 'large',
    });
  }

  public openFormModal(): void {
    this.openModalInstance(ModalFormDemoComponent);
  }

  public hideButtons(): void {
    this.buttonsHidden = true;
  }

  public showButtons(): void {
    this.buttonsHidden = false;
  }

  private openModalInstance(
    modalType: any,
    options?: SkyModalConfigurationInterface
  ): SkyModalInstance {
    this.hideButtons();

    const instance = this.modal.open(modalType, options);

    instance.closed.subscribe(() => {
      this.showButtons();
    });

    instance.componentInstance.showHelp = this.showHelp;

    return instance;
  }
}
