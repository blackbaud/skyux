import { Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  SkyTextEditorMergeField,
  SkyTextEditorStyleState,
} from '@skyux/text-editor';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent {
  @Input()
  public inlineHelpFlag = false;

  @Input()
  public set disabledFlag(value: boolean) {
    this.#_disabledFlag = value;

    if (value) {
      this.myForm.disable();
    } else {
      this.myForm.enable();
    }
  }

  public get disabledFlag(): boolean {
    return this.#_disabledFlag;
  }

  public myForm: UntypedFormGroup;

  public placeholder = 'This is what placeholder text looks like';

  public menus = ['edit', 'format', 'merge-field'];

  public mergeFields: SkyTextEditorMergeField[] = [
    {
      id: '1',
      name: 'Merge Field 1',
      previewImageUrl:
        'https://en.wikipedia.org/wiki/Wikipedia:Images#/media/File:Alcoba%C3%A7a_October_2021-1.jpg',
    },
    {
      id: '2',
      name: 'Merge Field 2',
    },
  ];

  public toolbarActions = [
    'font-family',
    'font-size',
    'font-style',
    'color',
    'list',
    'alignment',
    'indentation',
    'undo-redo',
    'link',
  ];

  public initialState = {
    boldState: true,
  } as SkyTextEditorStyleState;

  #_disabledFlag = false;

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      myText: new UntypedFormControl(),
    });
  }
}
