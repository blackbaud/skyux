import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SkyVerticalTabsetModule } from '@skyux/tabs';
import { SkyTextEditorModule } from '@skyux/text-editor';

import { startWith } from 'rxjs';

@Component({
  selector: 'app-text-editor-series',
  templateUrl: './text-editor-series.component.html',
  styleUrls: ['./text-editor-series.component.scss'],
  imports: [SkyTextEditorModule, SkyVerticalTabsetModule, ReactiveFormsModule],
})
export class TextEditorSeriesComponent implements OnInit {
  public displayValue: Record<string, SafeHtml> = {};

  public myForm: FormGroup;

  public editors = ['textEditor1', 'textEditor2', 'textEditor3', 'textEditor4'];

  readonly #destroyRef = inject(DestroyRef);
  readonly #formBuilder = inject(FormBuilder);
  readonly #sanitizer = inject(DomSanitizer);

  public ngOnInit(): void {
    this.myForm = this.#formBuilder.group({
      textEditor1: new FormControl(
        '<font style="font-size: 16px" color="#a25353"><b><i><u>Super styled text 1</u></i></b></font>',
        [Validators.required],
      ),
      textEditor2: new FormControl(
        '<font style="font-size: 16px" color="#a25353"><b><i><u>Super styled text 2</u></i></b></font>',
        [Validators.required],
      ),
      textEditor3: new FormControl(
        '<font style="font-size: 16px" color="#a25353"><b><i><u>Super styled text 3</u></i></b></font>',
        [Validators.required],
      ),
      textEditor4: new FormControl(
        '<font style="font-size: 16px" color="#a25353"><b><i><u>Super styled text 4</u></i></b></font>',
        [Validators.required],
      ),
    });

    this.myForm.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef), startWith(this.myForm.value))
      .subscribe((value) => {
        for (const key in value) {
          this.displayValue[key] = this.#sanitizer.bypassSecurityTrustHtml(
            value[key],
          );
        }
      });
  }
}
