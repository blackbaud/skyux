import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupModule,
  SkyLookupShowMoreConfig,
  SkyLookupShowMoreCustomPickerContext,
} from '@skyux/lookup';
import { SkyModalService } from '@skyux/modals';

import { Person } from './person';
import { PickerModalComponent } from './picker-modal.component';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class DemoComponent implements OnInit {
  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<Person[] | null>;
  }>;

  protected showMoreConfig: SkyLookupShowMoreConfig;
  protected searchFilters: SkyAutocompleteSearchFunctionFilter[];

  protected people: Person[] = [
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

  readonly #modalSvc = inject(SkyModalService);

  constructor() {
    this.favoritesForm = inject(FormBuilder).group({
      favoriteNames: [[this.people[15]]],
    });

    this.searchFilters = [
      (_, item): boolean => {
        const names = this.favoritesForm.value.favoriteNames;

        // Only show people in the search results that have not been chosen already.
        return !names?.some((option) => option.name === item.name);
      },
    ];

    this.showMoreConfig = {
      customPicker: {
        open: (context): void => {
          const instance = this.#modalSvc.open(PickerModalComponent, {
            providers: [
              {
                provide: SkyLookupShowMoreCustomPickerContext,
                useValue: context,
              },
            ],
            size: 'large',
          });

          instance.closed.subscribe((closeArgs) => {
            if (closeArgs.reason === 'save') {
              this.favoritesForm.controls.favoriteNames.setValue(
                closeArgs.data,
              );
            }
          });
        },
      },
    };
  }

  public ngOnInit(): void {
    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.favoritesForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  protected onAddButtonClicked(): void {
    alert('Add button clicked!');
  }

  protected onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }
}
