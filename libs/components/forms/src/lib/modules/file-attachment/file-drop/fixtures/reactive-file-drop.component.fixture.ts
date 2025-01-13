import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SkyFileItem } from '../../shared/file-item';
import { SkyFileDropModule } from '../file-drop.module';
import { SkyFileLink } from '../file-link';

@Component({
  imports: [SkyFileDropModule, FormsModule, ReactiveFormsModule, CommonModule],
  selector: 'sky-file-drop-reactive-test',
  standalone: true,
  templateUrl: './reactive-file-drop.component.fixture.html',
})
export class ReactiveFileDropTestComponent {
  public formGroup: FormGroup;
  public fileDrop: FormControl;
  public labelText: string | undefined;
  public acceptedTypes: string | undefined;

  constructor(formBuilder: FormBuilder) {
    this.fileDrop = new FormControl(undefined, Validators.required);
    this.formGroup = formBuilder.group({
      fileDrop: this.fileDrop,
    });
  }

  public deleteFile(file: SkyFileItem | SkyFileLink): void {
    const index = this.fileDrop.value.indexOf(file);
    if (index !== -1) {
      this.fileDrop.value?.splice(index, 1);
    }
    if (this.fileDrop.value.length === 0) {
      this.fileDrop.setValue(null);
    }
  }
}
