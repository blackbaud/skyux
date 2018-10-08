import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'lookup-visual',
  templateUrl: './lookup-visual.component.html'
})
export class LookupVisualComponent implements OnInit {
  public form: FormGroup;

  public people: any[] = [
    { name: 'Andy' },
    { name: 'Beth' },
    { name: 'David' },
    { name: 'Frank' },
    { name: 'Grace' },
    { name: 'Isaac' },
    { name: 'John' },
    { name: 'Joyce' },
    { name: 'Lindsey' },
    { name: 'Mitch' },
    { name: 'Patty' },
    { name: 'Paul' },
    { name: 'Quincy' },
    { name: 'Sally' },
    { name: 'Susan' },
    { name: 'Vanessa' },
    { name: 'Winston' },
    { name: 'Xavier' },
    { name: 'Yolanda' },
    { name: 'Zack' }
  ];

  public friends: any[] = [
    { name: 'Susan' },
    { name: 'Zack' }
  ];

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.createForm();
  }

  public enableLookup() {
    this.form.controls.friends.enable();
  }

  public disableLookup() {
    this.form.controls.friends.disable();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      friends: new FormControl(this.friends)
    });
  }
}
