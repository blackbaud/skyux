import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';
import {
  SkySelectField,
  SkySelectFieldCustomPicker,
  SkySelectFieldPickerContext,
} from '@skyux/select-field';

import { BehaviorSubject } from 'rxjs';

import { SelectFieldDemoCustomPickerContext } from './select-field-demo-custom-picker-context';
import { SelectFieldDemoCustomPickerComponent } from './select-field-demo-custom-picker.component';

@Component({
  selector: 'app-select-field-demo',
  templateUrl: 'select-field-demo.component.html',
  styleUrls: ['./select-field-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFieldDemoComponent implements OnInit {
  public colors: any[] = [
    { id: '1', label: 'Red' },
    { id: '2', label: 'Green' },
    { id: '3', label: 'Violet' },
  ];

  public colorStream: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public customFavoriteColorPicker: SkySelectFieldCustomPicker = {
    open: (pickerContext, setValue) => {
      this.showCustomPicker('color', pickerContext, setValue);
    },
  };

  public customFavoriteFruitPicker: SkySelectFieldCustomPicker = {
    open: (pickerContext, setValue) => {
      this.showCustomPicker('fruit', pickerContext, setValue);
    },
  };

  public fruits: any[] = [
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
      category: 'Citrus',
      label: 'Lemon',
      description: 'Larry eats lemons',
    },
    {
      id: '6',
      category: 'Aggregate fruit',
      label: 'Strawberry',
      description: 'Sally eats strawberries',
    },
  ];

  public fruitStream: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modal: SkyModalService
  ) {}

  public ngOnInit(): void {
    this.createForm();
    this.populateData();
  }

  public onSubmit(): void {
    alert('Form submitted with: \n' + JSON.stringify(this.myForm.value));
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      favoriteColor: new FormControl(),
      favoriteFruits: new FormControl(),
    });
  }

  private populateData(): void {
    this.fruitStream.next(this.fruits);
    this.colorStream.next(this.colors);
  }

  private showCustomPicker(
    pickerType: 'color' | 'fruit',
    pickerContext: SkySelectFieldPickerContext,
    setValue: (value: SkySelectField[]) => void
  ): void {
    const picker = this.modal.open(SelectFieldDemoCustomPickerComponent, [
      {
        provide: SelectFieldDemoCustomPickerContext,
        useValue: {
          pickerContext,
          pickerType,
        },
      },
    ]);

    picker.closed.subscribe((args: SkyModalCloseArgs) => {
      if (args.reason === 'save') {
        setValue(args.data);
      }
    });
  }
}
