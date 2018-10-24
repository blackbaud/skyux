import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SkySelectFieldComponent } from '../select-field.component';

@Component({
  selector: 'sky-select-field-test',
  templateUrl: './select-field.component.fixture.html'
})
export class SkySelectFieldTestComponent implements OnInit, OnDestroy {
  public ariaLabel: string;
  public ariaLabelledBy: string;
  public descriptorKey: string;
  public disabled: boolean;
  public selectMode: string;
  public multipleSelectOpenButtonText: string;
  public singleSelectClearButtonTitle: string;
  public singleSelectOpenButtonTitle: string;
  public singleSelectPlaceholderText: string;
  public pickerHeading: string;

  public data = new BehaviorSubject<any[]>([]);

  public formData: any = {};
  public staticData = [
    { id: '1', category: 'Pome', label: 'Apple', description: 'Anne eats apples' },
    { id: '2', category: 'Berry', label: 'Banana', description: 'Ben eats bananas' },
    { id: '3', category: 'Pome', label: 'Pear', description: 'Patty eats pears' },
    { id: '4', category: 'Berry', label: 'Grape', description: 'George eats grapes' },
    { id: '5', category: 'Berry', label: 'Banana', description: 'Becky eats bananas' },
    { id: '6', category: 'Citrus', label: 'Lemon', description: 'Larry eats lemons' },
    { id: '7', category: 'Aggregate fruit', label: 'Strawberry', description: 'Sally eats strawberries' }
  ];

  @ViewChild(SkySelectFieldComponent, { read: ElementRef })
  public selectFieldElementRef: ElementRef;

  @ViewChild(SkySelectFieldComponent)
  public selectField: SkySelectFieldComponent;

  public ngOnInit() {
    this.data.next(this.staticData);
  }

  public ngOnDestroy() {
    this.data.complete();
  }

  public onModelChange() {}

  public setValue(value: any) {
    this.formData.modelValue = value;
  }
}
