import { Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  SkyTextEditorMenuType,
  SkyTextEditorMergeField,
  SkyTextEditorStyleState,
  SkyTextEditorToolbarActionType,
} from '@skyux/text-editor';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  standalone: false,
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

  public labelText = 'Text editor';

  public hintText = 'Hint text';

  public myForm: UntypedFormGroup;

  public placeholder = 'This is what placeholder text looks like';

  public menus: SkyTextEditorMenuType[] = ['edit', 'format', 'merge-field'];

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

  public toolbarActions: SkyTextEditorToolbarActionType[] = [
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
      myText: new UntypedFormControl(undefined, Validators.required),
    });
  }
}
