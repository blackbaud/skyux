import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyCharacterCounterInputDirective } from '../character-counter.directive';

@Component({
  selector: 'sky-character-count-test',
  templateUrl: './character-count.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CharacterCountTestComponent {
  public testForm: UntypedFormGroup;
  public firstName: UntypedFormControl;
  public firstNameLabel = 'Field label';
  public lastName: UntypedFormControl;
  public maxCharacterCount: number | undefined = 5;
  public maxCharacterCountLastName: number | undefined = 5;

  @ViewChild(SkyCharacterCounterInputDirective)
  public inputDirective: SkyCharacterCounterInputDirective | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #formBuilder = inject(UntypedFormBuilder);

  constructor() {
    this.firstName = this.#formBuilder.control('test');
    this.lastName = this.#formBuilder.control('last');

    this.testForm = this.#formBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }

  public setCharacterCountLimit(limit: number | undefined): void {
    this.maxCharacterCount = limit;
    this.maxCharacterCountLastName = limit;
    this.#changeDetector.markForCheck();
  }
}
