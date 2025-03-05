import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { SplitViewModalComponent } from './layout/fit/modal.component';
import { ModalCloseConfirmComponent } from './modal-close-confirm.component';
import { ModalContentAutofocusComponent } from './modal-content-autofocus.component';
import { ModalContentDemoComponent } from './modal-content-demo.component';
import { ModalDemoComponent } from './modal-demo.component';
import { ModalDirtyComponent } from './modal-dirty.component';
import { ModalErrorComponent } from './modal-error.component';
import { ModalFormDemoComponent } from './modal-form-demo.component';
import { ModalFullPageDemoComponent } from './modal-full-page-demo.component';
import { ModalLookupComponent } from './modal-lookup.component';
import { ModalRequiredComponent } from './modal-required.component';
import { ModalTiledDemoComponent } from './modal-tiled-demo.component';
import { ModalWithTabsComponent } from './modal-with-tabs.component';

@Component({
  selector: 'app-modal-visual',
  templateUrl: './modal-visual.component.html',
  styleUrls: ['./modal-visual.component.scss'],
  imports: [FormsModule],
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

  public openLookupModal(): void {
    this.openModalInstance(ModalLookupComponent, {
      providers: [],
      fullPage: false,
      size: 'small',
    });
  }

  public openDirtyModal(): void {
    this.openModalInstance(ModalDirtyComponent);
  }

  public openErrorModal(): void {
    this.openModalInstance(ModalErrorComponent);
  }

  protected openRequiredFieldModal(): void {
    this.openModalInstance(ModalRequiredComponent);
  }

  protected openTabsModal(): void {
    this.openModalInstance(ModalWithTabsComponent, { size: 'large' });
  }

  protected openSplitviewModal(): void {
    this.openModalInstance(SplitViewModalComponent, { size: 'large' });
  }

  public hideButtons(): void {
    this.buttonsHidden = true;
  }

  public showButtons(): void {
    this.buttonsHidden = false;
  }

  private openModalInstance(
    modalType: any,
    options?: SkyModalConfigurationInterface,
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
