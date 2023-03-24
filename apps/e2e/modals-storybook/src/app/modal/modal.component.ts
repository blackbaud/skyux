import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalBasicComponent } from './modals/modal-basic.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(private modal: SkyModalService) {}

  public onOpenModalClick(): void {
    this.modal.open(ModalBasicComponent, {
      providers: [],
    });
  }

  public onOpenSmallModalClick(): void {
    this.modal.open(ModalBasicComponent, {
      providers: [],
      size: 'small',
    });
  }

  public onOpenMediumModalClick(): void {
    this.modal.open(ModalBasicComponent, {
      providers: [],
      size: 'medium',
    });
  }

  public onOpenLargeModalClick(): void {
    this.modal.open(ModalBasicComponent, {
      providers: [],
      size: 'large',
    });
  }

  public onOpenFullPageModalClick(): void {
    this.modal.open(ModalBasicComponent, {
      providers: [],
      fullPage: true,
    });
  }

  public onOpenHelpInlineModalClick(): void {
    const modalInstance = this.modal.open(ModalBasicComponent, {
      providers: [],
    });
    modalInstance.componentInstance.showHelp = true;
  }
}
