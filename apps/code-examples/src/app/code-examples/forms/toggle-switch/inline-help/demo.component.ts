import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { Subject, takeUntil } from 'rxjs';

interface ToggleSwitchFormType {
  controlToggle: FormControl<boolean | null>;
  dynamicToggle: FormControl<boolean | null>;
}

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyHelpInlineModule,
    SkyToggleSwitchModule,
  ],
})
export class DemoComponent implements OnDestroy {
  protected formGroup: FormGroup;

  #ngUnsubscribe = new Subject<void>();

  constructor() {
    this.formGroup = inject(FormBuilder).group<ToggleSwitchFormType>({
      controlToggle: new FormControl(false),
      dynamicToggle: new FormControl({ value: true, disabled: true }),
    });

    this.formGroup
      .get('controlToggle')
      ?.valueChanges.pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((value) => {
        if (value) {
          this.formGroup.get('dynamicToggle')?.enable();
        } else {
          this.formGroup.get('dynamicToggle')?.disable();
        }
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  protected onHelpClick(): void {
    alert(`Help clicked`);
  }
}
