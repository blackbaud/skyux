import { Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

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

  private richText = `<font style="font-size: 18px" face="Arial" color="#a25353"><b>Exclusively committed to your impact</b></font><p>Since day one, Blackbaud has been 100% focused on driving impact for social good organizations.</p><p>We equip change agents with <b>cloud software</b>, <i>services</i>, <u>expertise</u>, and <font color="#a25353">data intelligence</font> designed with unmatched insight and supported with unparalleled commitment. Every day, our <b>customers</b> achieve unmatched impact as they advance their missions.</p><ul><li><a href="#">Build a better world</a></li><li><a href="#">Explore our solutions</a></li></ul>`;

  #_disabledFlag = false;

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      myText: new UntypedFormControl(this.richText),
    });
  }
}
