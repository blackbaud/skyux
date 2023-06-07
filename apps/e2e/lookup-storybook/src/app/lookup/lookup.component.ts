import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface Names {
  name: string;
}
@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
})
export class LookupComponent {
  @Input()
  public selectMode: 'single' | 'multiple' = 'single';

  @Input()
  public disabledFlag = false;

  public placeholderText = 'This is what placeholder text looks like';

  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<Names[] | null>;
    favoriteNamesAll: FormControl<Names[] | null>;
    favoriteNamesFew: FormControl<Names[] | null>;
  }>;

  public people: Names[] = [
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

  constructor(formBuilder: FormBuilder) {
    this.favoritesForm = formBuilder.group({
      favoriteNames: [[this.people[10]]],
      favoriteNamesAll: [this.people],
      favoriteNamesFew: [[this.people[0], this.people[1], this.people[2]]],
    });
  }
}
