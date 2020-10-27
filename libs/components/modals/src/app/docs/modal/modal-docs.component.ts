import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyModalService
} from '../../public/public_api';

import {
  ModalDocsModalComponent
} from './modal-docs-modal.component';

@Component({
  selector: 'app-modal-docs',
  templateUrl: './modal-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDocsComponent {

  public helpKey: string;

  public modalSize: string = 'medium';

  public modalSizeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'fullScreen', label: 'Full screen' },
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  constructor(
    private modal: SkyModalService,
    public themeSvc: SkyThemeService
  ) { }

  public onOpenModalClick(): void {
    const modalInstanceType: any = ModalDocsModalComponent;
    const options: any = {
      helpKey: this.helpKey
    };

    switch (this.modalSize) {
      case 'fullScreen':
      options.fullPage = true;
      break;
      case 'small':
      options.size = 'small';
      break;
      case 'medium':
      options.size = 'medium';
      break;
      case 'large':
      options.size = 'large';
      break;
      default:
      break;
    }

    this.modal.open(modalInstanceType, options);
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.modalSize) {
      this.modalSize = change.modalSize;
    }
    if (change.showHelpButton === true) {
      this.helpKey = 'demo-key.html';
    }
    if (change.showHelpButton === false) {
      this.helpKey = undefined;
    }
  }

}
