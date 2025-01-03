import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-lookup',
  templateUrl: './modal-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ModalLookupComponent {
  protected readonly people = [
    { id: 1, name: 'Andy' },
    { id: 2, name: 'Beth' },
    { id: 3, name: 'David' },
    { id: 4, name: 'Frank' },
    { id: 5, name: 'Grace' },
    { id: 6, name: 'Isaac' },
    { id: 7, name: 'John' },
    { id: 8, name: 'Jupiter' },
    { id: 9, name: 'Joyce' },
    { id: 10, name: 'Lindsey' },
    { id: 11, name: 'Mitch' },
    { id: 12, name: 'Patty' },
    { id: 13, name: 'Paul' },
    { id: 14, name: 'Quincy' },
    { id: 15, name: 'Sally' },
    { id: 16, name: 'Susan' },
    { id: 17, name: 'Vanessa' },
    { id: 18, name: 'Winston' },
    { id: 19, name: 'Xavier' },
    { id: 20, name: 'Yolanda' },
    { id: 21, name: 'Zack' },
  ];
  protected readonly lookupDemoForm: FormGroup;

  constructor() {
    const formBuilder = inject(FormBuilder);
    this.lookupDemoForm = formBuilder.group({
      favoriteNames: [[]],
    });
  }

  public onSubmit(): void {
    console.log({ submitted: this.lookupDemoForm.value });
  }
}
