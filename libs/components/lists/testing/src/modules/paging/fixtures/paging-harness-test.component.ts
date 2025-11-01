import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';
import {
  SkyPagingContentChangeArgs,
  SkyPagingModule,
  SkyRepeaterModule,
} from '@skyux/lists';

import { Subject, of, shareReplay, switchMap } from 'rxjs';

const people = [
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

@Component({
  selector: 'test-paging-harness',
  templateUrl: './paging-harness-test.component.html',
  imports: [
    CommonModule,
    SkyDescriptionListModule,
    SkyPagingModule,
    SkyRepeaterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingHarnessTestComponent {
  public pageSize = 5;
  public maxPages = 3;
  protected currentPage = 1;
  protected contentChange = new Subject<SkyPagingContentChangeArgs>();

  protected pagedData = this.contentChange.pipe(
    switchMap((args) => {
      const startIndex = (args.currentPage - 1) * this.pageSize;

      args.loadingComplete();

      return of({
        people: people.slice(startIndex, startIndex + this.pageSize),
        totalCount: people.length,
      });
    }),
    shareReplay(1),
  );
}
