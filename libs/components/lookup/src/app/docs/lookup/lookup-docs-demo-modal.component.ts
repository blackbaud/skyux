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

@Component({
  selector: 'lookup-docs-demo-modal',
  templateUrl: './lookup-docs-demo-modal.component.html'
})
export class SkyLookupDocsDemoModalComponent implements OnInit {

  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public modalInstance: SkyModalInstance
  ) { }

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      name: new FormControl()
    });
  }

}
