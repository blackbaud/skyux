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

  public placeholder = 'Enter text here';

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

  //private richText = `<font style="font-size: 18px" face="Arial" color="#a25353"><b>Exclusively committed to your impact</b></font><p>Since day one, Blackbaud has been 100% focused on driving impact for social good organizations.</p><p>We equip change agents with <b>cloud software</b>, <i>services</i>, <u>expertise</u>, and <font color="#a25353">data intelligence</font> designed with unmatched insight and supported with unparalleled commitment. Every day, our <b>customers</b> achieve unmatched impact as they advance their missions.</p><ul><li><a href="#">Build a better world</a></li><li><a href="#">Explore our solutions</a></li></ul>`;

  #_disabledFlag = false;

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      myText: new UntypedFormControl(),
    });
  }
}
