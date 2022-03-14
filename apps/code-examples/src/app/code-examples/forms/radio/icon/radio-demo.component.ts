import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-demo',
  templateUrl: './radio-demo.component.html',
})
export class RadioDemoComponent implements OnInit {
  public myForm: FormGroup;

  public views: any[] = [
    { icon: 'table', label: 'Table', name: 'table' },
    { icon: 'list', label: 'List', name: 'list' },
    { icon: 'map-marker', label: 'Map', name: 'map' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      myView: this.views[0].name,
    });
  }
}
