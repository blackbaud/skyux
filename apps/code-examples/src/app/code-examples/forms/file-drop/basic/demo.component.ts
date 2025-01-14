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
 * Demonstrates how to create a custom validator function for your form control.
 */
function customValidator(
  control: AbstractControl<(SkyFileItem | SkyFileLink)[] | null | undefined>,
): ValidationErrors | null {
  if (control.value !== undefined && control.value !== null) {
    if (control.value.length > 3) {
      return { maxNumberOfFilesReached: true };
    }
  }
  return null;
}

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    SkyFileDropModule,
    SkyStatusIndicatorModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DemoComponent {
  protected acceptedTypes = 'image/png,image/jpeg';
  protected allItems: (SkyFileItem | SkyFileLink)[] = [];
  protected hintText = '5 MB maximum';
  protected inlineHelpContent =
    'Your logo appears in places such as authentication pages, student and parent portals, and extracurricular home pages.';
  protected labelText = 'Logo image';
  protected maxFileSize = 5242880;
  protected rejectedFiles: SkyFileItem[] = [];
  protected stacked = 'true';

  protected fileDrop = new FormControl<
    (SkyFileItem | SkyFileLink)[] | null | undefined
  >(undefined, [Validators.required, customValidator]);
  protected formGroup: FormGroup = inject(FormBuilder).group({
    fileDrop: this.fileDrop,
  });

  protected deleteFile(file: SkyFileItem | SkyFileLink): void {
    const index = this.fileDrop.value?.indexOf(file);

    if (index !== undefined && index !== -1) {
      this.fileDrop.value?.splice(index, 1);
    }
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
