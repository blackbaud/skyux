import { CommonModule } from '@angular/common';
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
import { SkyFileDropModule, SkyFileItem, SkyFileLink } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

/**
 * @title File drop with help key
 */
@Component({
  selector: 'app-forms-file-drop-help-key-example',
  templateUrl: './example.component.html',
  imports: [SkyFileDropModule, SkyStatusIndicatorModule],
})
export class FormsFileDropHelpKeyExampleComponent {
  protected acceptedTypes = 'image/png,image/jpeg';
  protected allItems: (SkyFileItem | SkyFileLink)[] = [];
  protected hintText = '5 MB maximum';
  protected labelText = 'Logo image';
  protected maxFileSize = 5242880;
  protected stacked = 'true';

  public fileDrop = new FormControl<
    (SkyFileItem | SkyFileLink)[] | null | undefined
  >(undefined, [Validators.required, customValidator]);
  public formGroup: FormGroup = inject(FormBuilder).group({
    fileDrop: this.fileDrop,
  });

  protected deleteFile(file: SkyFileItem | SkyFileLink): void {
    const index = this.fileDrop.value?.indexOf(file);

    if (index !== undefined && index !== -1) {
      this.fileDrop.value?.splice(index, 1);
      /*
        If you are adding custom validation through the form control,
        be sure to include this line after deleting a file from the form.
      */
      this.fileDrop.updateValueAndValidity();
    }
    // To ensure that empty arrays throw required errors, include this check.
    if (this.fileDrop.value?.length === 0) {
      this.fileDrop.setValue(null);
    }
  }

  protected validateFile(file: SkyFileItem): string | undefined {
    return file.file.name.startsWith('a')
      ? 'Upload a file that does not begin with the letter "a"'
      : undefined;
  }
}
