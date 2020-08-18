import {
  Component,
  OnInit
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkySelectField
} from '../../public/public_api';

@Component({
  selector: 'select-field-visual',
  templateUrl: './select-field-visual.component.html'
})
export class SelectFieldVisualComponent implements OnInit {

  public data = new BehaviorSubject<SkySelectField[]>([]);

  public model: any = {};

  public reactiveForm: FormGroup;

  public get reactiveFruit(): AbstractControl {
    return this.reactiveForm.get('fruits');
  }

  public remoteData = new BehaviorSubject<any[]>([]);

  public staticData = [
    { id: '1', category: 'Pome', label: 'Apple', description: 'Anne eats apples' },
    { id: '2', category: 'Berry', label: 'Banana', description: 'Ben eats bananas' },
    { id: '3', category: 'Pome', label: 'Pear', description: 'Patty eats pears' },
    { id: '4', category: 'Berry', label: 'Grape', description: 'George eats grapes' },
    { id: '5', category: 'Berry', label: 'Banana', description: 'Becky eats bananas' },
    { id: '6', category: 'Citrus', label: 'Lemon', description: 'Larry eats lemons' },
    { id: '7', category: 'Aggregate fruit', label: 'Strawberry', description: 'Sally eats strawberries' },
    { id: '8', category: 'Aggregate fruit',
      // tslint:disable-next-line:max-line-length
      label: 'Strawberries that were picked in the dead of winter when the ground was covered with five inches of snow from a giant blizzard that blew through the area late at night.',
      description: 'Sally eats strawberries in the cold' }
  ];

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.data.next(this.staticData);
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      fruits: new FormControl()
    });
  }

  public populateSelected() {
    this.model.multiple = [
      this.staticData[1],
      this.staticData[2],
      this.staticData[3]
    ];
    this.model.single = this.staticData[3];
  }

  public populateSelectedLong() {
    this.model.multiple = [
      this.staticData[1],
      this.staticData[2],
      this.staticData[7]
    ];
    this.model.single = this.staticData[7];
  }

  public onAddNewRecordButtonClick(): void {
    console.log('Add new record button clicked!');
  }

  public populateFormControl() {
    this.reactiveForm.controls['fruits'].setValue(this.staticData[0]);
  }

  public getJsonValue(value: any): string {
    return JSON.stringify(value);
  }

  /**
   * Simulate a remote call to update the search results.
   */
  public onSearchApplied(searchText: string): void {
    console.log('Searching remote source for string: ' + searchText);
    setTimeout(() => {
      this.remoteData.next([
        { id: '1', label: 'George' },
        { id: '2', label: 'Ringo' },
        { id: '3', label: 'John' },
        { id: '4', label: 'Paul' }
      ]);
    }, 2000);
  }
}
