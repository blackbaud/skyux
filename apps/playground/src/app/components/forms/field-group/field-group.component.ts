import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyFieldGroupModule, SkyInputBoxModule } from '@skyux/forms';

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyFieldGroupModule,
    SkyInputBoxModule,
  ],
})
export class FieldGroupComponent implements OnInit {
  public formGroup: FormGroup;

  #formBuilder = inject(FormBuilder);

  public ngOnInit(): void {
    this.formGroup = this.#formBuilder.group({
      name: new FormControl(undefined),
    });
  }
}
