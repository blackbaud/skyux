import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SkyTextEditorModule } from '@skyux/text-editor';

function validateText(
  control: AbstractControl<string>,
): ValidationErrors | null {
  return !control.value?.includes('Blackbaud') ? { companyName: true } : null;
}

/**
 * @title Text editor with basic setup
 */
@Component({
  selector: 'app-text-editor-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyTextEditorModule],
})
export class TextEditorExampleComponent {
  protected formGroup: FormGroup;
  public myText: FormControl;

  #richText = `<font style="font-size: 18px" face="Arial" color="#a25353"><b>Exclusively committed to your impact</b></font><p>Since day one, Blackbaud has been 100% focused on driving impact for social good organizations.</p><p>We equip change agents with <b>cloud software</b>, <i>services</i>, <u>expertise</u>, and <font color="#a25353">data intelligence</font> designed with unmatched insight and supported with unparalleled commitment. Every day, our <b>customers</b> achieve unmatched impact as they advance their missions.</p>`;

  constructor() {
    this.myText = new FormControl(this.#richText, {
      nonNullable: true,
      validators: [Validators.required, validateText],
    });

    this.formGroup = inject(FormBuilder).group({
      myText: this.myText,
    });
  }
}
