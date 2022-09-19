import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-demo',
  templateUrl: './radio-demo.component.html',
})
export class RadioDemoComponent {
  public myForm: FormGroup;

  public views: any[] = [
    { icon: 'table', label: 'Table', name: 'table' },
    { icon: 'list', label: 'List', name: 'list' },
    { icon: 'map-marker', label: 'Map', name: 'map' },
  ];

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      myView: this.views[0].name,
    });
  }
}
