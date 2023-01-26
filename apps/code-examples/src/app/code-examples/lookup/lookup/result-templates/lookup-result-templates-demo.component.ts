import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  selector: 'app-lookup-demo',
  templateUrl: './lookup-result-templates-demo.component.html',
  styleUrls: ['./lookup-result-templates-demo.component.scss'],
})
export class LookupResultTemplatesDemoComponent implements OnInit {
  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<LookupDemoPerson[] | null>;
  }>;

  public searchFilters: SkyAutocompleteSearchFunctionFilter[];

  public people: LookupDemoPerson[] = [
    {
      name: 'Abed',
      formal: 'Mr. Nadir',
    },
    {
      name: 'Alex',
      formal: 'Mr. Osbourne',
    },
    {
      name: 'Ben',
      formal: 'Mr. Chang',
    },
    {
      name: 'Britta',
      formal: 'Ms. Perry',
    },
    {
      name: 'Buzz',
      formal: 'Mr. Hickey',
    },
    {
      name: 'Craig',
      formal: 'Mr. Pelton',
    },
    {
      name: 'Elroy',
      formal: 'Mr. Patashnik',
    },
    {
      name: 'Garrett',
      formal: 'Mr. Lambert',
    },
    {
      name: 'Ian',
      formal: 'Mr. Duncan',
    },
    {
      name: 'Jeff',
      formal: 'Mr. Winger',
    },
    {
      name: 'Leonard',
      formal: 'Mr. Rodriguez',
    },
    {
      name: 'Neil',
      formal: 'Mr. Neil',
    },
    {
      name: 'Pierce',
      formal: 'Mr. Hawthorne',
    },
    {
      name: 'Preston',
      formal: 'Mr. Koogler',
    },
    {
      name: 'Rachel',
      formal: 'Ms. Rachel',
    },
    {
      name: 'Shirley',
      formal: 'Ms. Bennett',
    },
    {
      name: 'Todd',
      formal: 'Mr. Jacobson',
    },
    {
      name: 'Troy',
      formal: 'Mr. Barnes',
    },
    {
      name: 'Vaughn',
      formal: 'Mr. Miller',
    },
    {
      name: 'Vicki',
      formal: 'Ms. Jenkins',
    },
  ];

  public showMoreConfig: SkyLookupShowMoreConfig = {
    nativePickerConfig: {},
  };

  @ViewChild('modalItemTemplate')
  public set modalItemTemplate(template: TemplateRef<unknown>) {
    if (this.showMoreConfig.nativePickerConfig) {
      this.showMoreConfig.nativePickerConfig.itemTemplate = template;
    } else {
      this.showMoreConfig.nativePickerConfig = { itemTemplate: template };
    }
  }

  constructor(formBuilder: FormBuilder) {
    this.favoritesForm = formBuilder.group({
      favoriteNames: [[this.people[15]]],
    });

    this.searchFilters = [
      (_, item): boolean => {
        const names = this.favoritesForm.value.favoriteNames;

        // Only show people in the search results that have not been chosen already.
        return !names?.some((option) => option.name === item.name);
      },
    ];
  }

  public ngOnInit(): void {
    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.favoritesForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  public onAddButtonClicked(): void {
    alert('Add button clicked!');
  }

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }
}
