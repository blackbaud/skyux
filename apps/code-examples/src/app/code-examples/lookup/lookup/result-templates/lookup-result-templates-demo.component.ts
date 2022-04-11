import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

@Component({
  selector: 'app-lookup-demo',
  templateUrl: './lookup-result-templates-demo.component.html',
  styleUrls: ['./lookup-result-templates-demo.component.scss'],
})
export class LookupResultTemplatesDemoComponent implements OnInit {
  public myForm: FormGroup;

  public people: any[] = [
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

  public names: any[] = [this.people[15]];

  public showMoreConfig: SkyLookupShowMoreConfig = {
    nativePickerConfig: {},
  };

  @ViewChild('modalItemTemplate')
  public set modalItemTempalte(template: TemplateRef<any>) {
    this.showMoreConfig.nativePickerConfig.itemTemplate = template;
  }

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm();

    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.myForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  // Only show people in the search results that have not been chosen already.
  public getSearchFilters(): SkyAutocompleteSearchFunctionFilter[] {
    const names: any[] = this.myForm.controls.names.value;
    return [
      (searchText: string, item: any): boolean => {
        const found = names.find((option) => option.name === item.name);
        return !found;
      },
    ];
  }

  public onAddButtonClicked(): void {
    alert('Add button clicked!');
  }

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.myForm.value));
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      names: new FormControl(this.names),
    });
  }
}
