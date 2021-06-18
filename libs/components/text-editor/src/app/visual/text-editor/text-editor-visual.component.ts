import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyTextEditorToolbarActions,
  SkyTextEditorMenu
} from '../../public/public_api';

@Component({
  selector: 'text-editor-visual',
  templateUrl: './text-editor-visual.component.html',
  styleUrls: ['./text-editor-visual.component.scss']
})
export class RichTextEditorVisualComponent {

  public displayValue: SafeHtml;

  public menus: SkyTextEditorMenu[] = [
    SkyTextEditorMenu.Edit,
    SkyTextEditorMenu.Format,
    SkyTextEditorMenu.MergeField
  ];

  public mergeFields = [
    {
      id: '0',
      name: 'Best field'
    },
    {
      id: '1',
      name: 'Second best field'
    },
    {
      id: '2',
      name: 'A field that is really too long for its own good'
    }
  ];

  public placeholder: string = 'Please enter some text';

  public toolbarActions: SkyTextEditorToolbarActions[] = [
    SkyTextEditorToolbarActions.FontFamily,
    SkyTextEditorToolbarActions.FontSize,
    SkyTextEditorToolbarActions.FontStyle,
    SkyTextEditorToolbarActions.Color,
    SkyTextEditorToolbarActions.List,
    SkyTextEditorToolbarActions.Alignment,
    SkyTextEditorToolbarActions.Indentation,
    SkyTextEditorToolbarActions.UndoRedo,
    SkyTextEditorToolbarActions.Link
  ];

  public set value(value: string) {
    if (this.value !== value) {
      this._value = value;
      this.displayValue = this.sanitizer.bypassSecurityTrustHtml(value);
      this.changeDetectorRef.detectChanges();
    }
  }

  public get value(): string {
    return this._value;
  }

  private _value = '<font style=\"font-size: 16px\" color=\"#a25353\"><b><i><u>Super styled text</u></i></b></font>';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private themeSvc: SkyThemeService
  ) {
    this.displayValue = this.sanitizer.bypassSecurityTrustHtml(this.value);
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

}
