import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SkyCharacterCounterInputDirective } from '../character-counter.directive';

@Component({
  selector: 'sky-character-count-test',
  templateUrl: './character-count-no-indicator.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCountNoIndicatorTestComponent {
  public testForm: FormGroup;
  public firstName: FormControl;
  public firstNameLabel = 'Field label';
  public maxCharacterCount: number | undefined = 5;

  @ViewChild(SkyCharacterCounterInputDirective)
  public inputDirective: SkyCharacterCounterInputDirective | undefined;

  #changeDetector: ChangeDetectorRef;
  #formBuilder: FormBuilder;

  constructor(formBuilder: FormBuilder, changeDetector: ChangeDetectorRef) {
    this.#formBuilder = formBuilder;
    this.#changeDetector = changeDetector;

    this.firstName = this.#formBuilder.control('test');

    this.testForm = this.#formBuilder.group({
      firstName: this.firstName,
    });
  }

  public setCharacterCountLimit(limit: number | undefined): void {
    this.maxCharacterCount = limit;
    this.#changeDetector.markForCheck();
  }
}
