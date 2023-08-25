import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

export interface Names {
  name: string;
}
@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
})
export class LookupComponent implements AfterViewInit {
  @HostBinding('class.sky-padding-even-md')
  public readonly classPaddingEvenMd = true;

  protected controlNames = new Map<'single' | 'multiple', string[]>([
    ['single', ['NoValue', 'OneValue']],
    ['multiple', ['NoValue', 'OneValue', 'SelectAll', 'SelectFew']],
  ]);

  protected selectModes: ('single' | 'multiple')[] = ['single', 'multiple'];

  protected disabledStates: ('Enabled' | 'Disabled')[] = [
    'Enabled',
    'Disabled',
  ];

  protected placeholderText = 'This is what placeholder text looks like';

  protected favoritesForm: FormGroup<{
    singleEnabledNoValue: FormControl<Names[] | null>;
    singleEnabledOneValue: FormControl<Names[] | null>;
    singleDisabledNoValue: FormControl<Names[] | null>;
    singleDisabledOneValue: FormControl<Names[] | null>;
    multipleEnabledNoValue: FormControl<Names[] | null>;
    multipleEnabledOneValue: FormControl<Names[] | null>;
    multipleEnabledSelectAll: FormControl<Names[] | null>;
    multipleEnabledSelectFew: FormControl<Names[] | null>;
    multipleDisabledNoValue: FormControl<Names[] | null>;
    multipleDisabledOneValue: FormControl<Names[] | null>;
    multipleDisabledSelectAll: FormControl<Names[] | null>;
    multipleDisabledSelectFew: FormControl<Names[] | null>;
  }>;

  protected people: Names[] = [
    { name: 'Abed' },
    { name: 'Alex' },
    { name: 'Ben' },
    { name: 'Brittany' },
    { name: 'Buzz' },
    { name: 'Craig' },
    { name: 'Elroy' },
    { name: 'Garrett' },
    { name: 'Ian' },
    { name: 'Jeff' },
    { name: 'Leonard' },
    { name: 'Neil' },
    { name: 'Pierce' },
    { name: 'Preston' },
    { name: 'Rachel' },
    { name: 'Shirley' },
    { name: 'Todd' },
    { name: 'Troy' },
    { name: 'Vaughn' },
    { name: 'Vicki' },
  ];

  protected ready = new BehaviorSubject<boolean>(false);

  constructor(formBuilder: FormBuilder) {
    this.favoritesForm = formBuilder.group({
      singleEnabledNoValue: [] as Names[] | null,
      singleEnabledOneValue: [[this.people[10]]],
      singleDisabledNoValue: [] as Names[] | null,
      singleDisabledOneValue: [[this.people[10]]],
      multipleEnabledNoValue: [] as Names[] | null,
      multipleEnabledOneValue: [[this.people[10]]],
      multipleEnabledSelectAll: [this.people],
      multipleEnabledSelectFew: [
        [this.people[0], this.people[1], this.people[2]],
      ],
      multipleDisabledNoValue: [] as Names[] | null,
      multipleDisabledOneValue: [[this.people[10]]],
      multipleDisabledSelectAll: [this.people],
      multipleDisabledSelectFew: [
        [this.people[0], this.people[1], this.people[2]],
      ],
    });

    this.selectModes.forEach((selectMode) => {
      this.controlNames.get(selectMode)?.forEach((controlName) => {
        this.favoritesForm
          .get(`${selectMode}Disabled${controlName}`)
          ?.disable();
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ready.next(true);
    }, 500);
  }
}
