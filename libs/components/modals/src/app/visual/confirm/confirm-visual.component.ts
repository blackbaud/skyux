import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyConfirmService,
  SkyConfirmType
} from '../../public/public_api';

@Component({
  selector: 'confirm-visual',
  templateUrl: './confirm-visual.component.html'
})
export class ConfirmVisualComponent {
  constructor(
    private confirmService: SkyConfirmService,
    private themeSvc: SkyThemeService
  ) { }

  public openOKConfirm() {
    this.confirmService.open({
      message: 'Do you wish to continue?',
      type: SkyConfirmType.OK
    });
  }

  public openYesCancelConfirm() {
    this.confirmService.open({
      message: 'Do you wish to continue?',
      type: SkyConfirmType.YesCancel
    });
  }

  public openConfirmWithBody() {
   this.confirmService.open({
      message: 'Do you wish to continue?',
      body: 'This could be dangerous!',
      type: SkyConfirmType.YesCancel
    });
  }

  public openYesNoCancelConfirm() {
    this.confirmService.open({
      message: 'Do you wish to continue?',
      type: SkyConfirmType.YesNoCancel
    });
  }

  public openCustomConfirm() {
    this.confirmService.open({
      message: [
        'This is really long text so that it goes to the next line. This is really long',
        'text so that it goes to the next line. This is really long text so that it goes to the',
        'next line.'
      ].join(' '),
      type: SkyConfirmType.Custom,
      buttons: [
        { text: '1', action: 'foo', styleType: 'primary' },
        { text: '2', action: 'bar', autofocus: true },
        { text: '3', action: 'baz' }
      ]
    });
  }

  public openPreserveWhiteSpaceConfirm(): void {
    const body = 'If you are seeing this message because of a problem with the form please contact:\n\t- email@email.com.';

    const message = `Are you sure you wish to cancel?
  - All unsaved progress will be lost!`;

    this.confirmService.open({
      body,
      message,
      preserveWhiteSpace: true,
      type: SkyConfirmType.OK
    });
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
