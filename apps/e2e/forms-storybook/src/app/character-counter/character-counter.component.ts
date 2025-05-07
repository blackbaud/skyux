import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-character-counter',
  templateUrl: './character-counter.component.html',
  standalone: false,
})
export class CharacterCounterComponent implements AfterViewInit, OnDestroy {
  public maxCharacterCount = 10;
  public variations: {
    id: string;
    formGroup: FormGroup;
    control: FormControl;
    model: string;
  }[] = [];
  public readonly ready = new BehaviorSubject<boolean>(false);

  #formBuilder = inject(FormBuilder);

  constructor() {
    const buildVariation = (
      id: string,
      reactiveValue: string,
      templateValue: string,
    ): {
      id: string;
      formGroup: FormGroup;
      control: FormControl;
      model: string;
    } => {
      const formGroup = this.#formBuilder.group({
        firstName: [reactiveValue],
      });
      const control = formGroup.get('firstName') as FormControl;
      return {
        id,
        formGroup,
        control,
        model: `${templateValue}`,
      };
    };

    this.variations.push(buildVariation('empty', '', ''));
    this.variations.push(buildVariation('valid', 'reactive', 'template'));
    this.variations.push(
      buildVariation('invalid', 'reactive form', 'template form'),
    );
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.ready.next(true);
    }, 100);
  }

  public ngOnDestroy(): void {
    this.ready.complete();
  }
}
