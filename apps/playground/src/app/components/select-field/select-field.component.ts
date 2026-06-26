import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';
import { SkySelectField, SkySelectFieldModule } from '@skyux/select-field';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select-field',
  imports: [
    SkyIdModule,
    SkySelectFieldModule,
    ReactiveFormsModule,
    JsonPipe,
    AsyncPipe,
    SkyLookupModule,
    SkyInputBoxModule,
  ],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.css',
})
export default class SelectFieldComponent {
  protected readonly environmentIdsStream = new BehaviorSubject<
    SkySelectField[]
  >([
    {
      id: 'dev',
      label: 'Development',
    },
    {
      id: 'test',
      label: 'Testing',
    },
    {
      id: 'prod',
      label: 'Production',
    },
  ]);
  protected readonly aggregateFunctionsStream = new BehaviorSubject<
    SkySelectField[]
  >([
    {
      id: 'sum',
      label: 'Sum',
    },
    {
      id: 'avg',
      label: 'Average',
    },
    {
      id: 'min',
      label: 'Minimum',
    },
    {
      id: 'max',
      label: 'Maximum',
    },
  ]);

  protected readonly selectFieldsForm = inject(FormBuilder).nonNullable.group({
    environmentIds: [
      [
        {
          id: 'dev',
          label: 'Development',
        },
      ],
    ],
    valueAggregateFunction: [
      {
        id: 'sum',
        label: 'Sum',
      },
    ],
  });

  protected readonly lookupForm = inject(FormBuilder).nonNullable.group({
    environmentIds: [
      [
        {
          id: 'dev',
          label: 'Development',
        },
      ],
    ],
    valueAggregateFunction: [
      [
        {
          id: 'sum',
          label: 'Sum',
        },
      ],
    ],
  });
}
