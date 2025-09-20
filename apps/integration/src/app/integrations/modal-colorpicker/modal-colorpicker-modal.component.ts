import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyIdModule } from '@skyux/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-modal-colorpicker-modal',
  templateUrl: './modal-colorpicker-modal.component.html',
  styleUrls: ['./modal-colorpicker-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyModalModule,
    FormsModule,
    SkyColorpickerModule,
    SkyIdModule,
    ReactiveFormsModule,
  ],
})
export class ModalColorpickerModalComponent {
  protected readonly colorForm: FormGroup;
  protected readonly cdr = inject(ChangeDetectorRef);

  protected readonly swatches12: string[] = [
    '#333333',
    '#888888',
    '#EFEFEF',
    '#FFF',
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
    '#A1B1A7',
    '#68AFEF',
  ];

  protected readonly swatches6: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  protected readonly modalInstance = inject(SkyModalInstance);

  constructor(formBuilder: FormBuilder) {
    this.colorForm = formBuilder.group({
      colorOne: new FormControl('#f00'),
      colorTwo: new FormControl('#ff0'),
      colorThree: new FormControl({ value: '#000', disabled: true }),
      colorFour: new FormControl('#00f'),
    });
  }
}
