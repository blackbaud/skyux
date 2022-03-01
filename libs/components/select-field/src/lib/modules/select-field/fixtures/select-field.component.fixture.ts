import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkySelectFieldComponent } from '../select-field.component';
import { SkySelectFieldCustomPicker } from '../types/select-field-custom-picker';

@Component({
  selector: 'sky-select-field-test',
  templateUrl: './select-field.component.fixture.html',
})
export class SkySelectFieldTestComponent implements OnInit, OnDestroy {
  public ariaLabel: string;

  public ariaLabelledBy: string;

  public customPicker: SkySelectFieldCustomPicker;

  public data = new BehaviorSubject<any[]>([]);

  public descriptorKey: string;

  public disabled: boolean;

  public formData: any = {};

  public inMemorySearchEnabled: boolean;

  public multipleSelectOpenButtonText: string;

  public pickerHeading: string;

  public selectMode: string;

  public singleSelectClearButtonTitle: string;

  public singleSelectOpenButtonTitle: string;

  public singleSelectPlaceholderText: string;

  public staticData = [
    {
      id: '1',
      category: 'Pome',
      label: 'Apple',
      description: 'Anne eats apples',
    },
    {
      id: '2',
      category: 'Berry',
      label: 'Banana',
      description: 'Ben eats bananas',
    },
    {
      id: '3',
      category: 'Pome',
      label: 'Pear',
      description: 'Patty eats pears',
    },
    {
      id: '4',
      category: 'Berry',
      label: 'Grape',
      description: 'George eats grapes',
    },
    {
      id: '5',
      category: 'Berry',
      label: 'Banana',
      description: 'Becky eats bananas',
    },
    {
      id: '6',
      category: 'Citrus',
      label: 'Lemon',
      description: 'Larry eats lemons',
    },
    {
      id: '7',
      category: 'Aggregate fruit',
      label: 'Strawberry',
      description: 'Sally eats strawberries',
    },
  ];

  public touched = 0;

  @ViewChild(SkySelectFieldComponent, {
    read: ElementRef,
    static: true,
  })
  public selectFieldElementRef: ElementRef;

  @ViewChild(SkySelectFieldComponent, {
    read: SkySelectFieldComponent,
    static: true,
  })
  public selectField: SkySelectFieldComponent;

  public ngOnInit(): void {
    this.data.next(this.staticData);
  }

  public ngOnDestroy(): void {
    this.data.complete();
  }

  public onModelChange(): void {}

  public setValue(value: any): void {
    this.formData.modelValue = value;
  }

  public onBlur(): void {
    this.touched += 1;
  }

  public onSearchApplied(searchText: string): void {}
}
