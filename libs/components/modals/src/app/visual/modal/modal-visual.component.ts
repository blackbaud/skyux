import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '../../public';

import {
  ModalDemoComponent
} from './modal-demo.component';

import {
  ModalLargeDemoComponent
} from './modal-large-demo.component';

import {
  ModalFullPageDemoComponent
} from './modal-fullpage-demo.component';

import {
  ModalContentDemoComponent
} from './modal-content-demo.component';

import {
  ModalTiledDemoComponent
} from './modal-tiled-demo.component';

import {
  ModalContentAutofocusComponent
} from './modal-content-autofocus.component';

import {
  ModalCloseConfirmComponent
} from './modal-close-confirm.component';

@Component({
  selector: 'modal-visual',
  templateUrl: './modal-visual.component.html'
})
export class ModalVisualComponent {
  constructor(private modal: SkyModalService) { }

  public openModal() {
    this.modal.open(ModalDemoComponent, { 'providers': [] });
  }

  public openModalWithHelp() {
    this.modal.open(ModalDemoComponent, { 'providers': [], 'helpKey': 'demo-key.html' });
  }

  public openModalWithExtendedTitle() {
    const instance = this.modal.open(ModalDemoComponent, { 'providers': [], 'helpKey': 'demo-key.html' });
    instance.componentInstance.title = 'This is a modal title with an extended header text that must wrap by default';
  }

  public openLargeModal() {
    this.modal.open(ModalLargeDemoComponent, { 'providers': [] });
  }

  public openFullScreenModal() {
    this.modal.open(ModalFullPageDemoComponent, { 'providers': [], 'fullPage': true });
  }

  public openContentModal() {
    this.modal.open(ModalContentDemoComponent);
  }

  public openSmallSizeModal() {
    this.modal.open(
      ModalDemoComponent, { 'providers': [], 'fullPage': false , 'size': 'small'});
  }

  public openMediumSizeModal() {
    this.modal.open(
      ModalDemoComponent, { 'providers': [], 'fullPage': false , 'size': 'medium'});
  }

  public openLargeSizeModal() {
    this.modal.open(
      ModalDemoComponent, { 'providers': [], 'fullPage': false , 'size': 'large'});
  }

  public openTiledModal() {
    this.modal.open(ModalTiledDemoComponent, { 'providers': [] });
  }

  public openAutofocusModal() {
    this.modal.open(
      ModalContentAutofocusComponent, { 'providers': [], 'fullPage': false , 'size': 'large'});
  }

  public openCloseConfirmationModal() {
    this.modal.open(
      ModalCloseConfirmComponent, { 'providers': [], 'fullPage': false , 'size': 'large'});
  }
}
