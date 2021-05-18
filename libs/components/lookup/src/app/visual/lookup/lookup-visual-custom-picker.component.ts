import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyLookupShowMoreCustomPickerContext
} from '../../public/public_api';

@Component({
  selector: 'lookup-visual-custom-picker',
  templateUrl: './lookup-visual-custom-picker.component.html'
})
export class SkyLookupVisualCustomPickerComponent implements OnInit {

  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public context: SkyLookupShowMoreCustomPickerContext,
    public modalInstance: SkyModalInstance
  ) { }

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      selectLast: new FormControl(false)
    });
  }

}
