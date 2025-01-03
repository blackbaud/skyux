import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SkyDateRangeCalculatorId } from '@skyux/datetime';
import { SkyThemeService } from '@skyux/theme';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delay, map, startWith } from 'rxjs/operators';

interface Person {
  name: string;
  id: string;
}

@Component({
  selector: 'app-field-heights',
  templateUrl: './field-heights.component.html',
  styleUrls: ['./field-heights.component.scss'],
  standalone: false,
})
export class FieldHeightsComponent implements AfterViewInit, OnDestroy {
  public readonly favoritesForm: FormGroup;

  public people: Person[] = [
    { name: 'John', id: '1' },
    { name: 'Jane', id: '2' },
    { name: 'Bob', id: '3' },
    { name: 'Sally', id: '4' },
    { name: 'Joe', id: '5' },
    { name: 'Jill', id: '6' },
    { name: 'Bill', id: '7' },
    { name: 'Sue', id: '8' },
    { name: 'Jim', id: '9' },
    { name: 'Jenny', id: '10' },
    { name: 'Sam', id: '11' },
    { name: 'Sara', id: '12' },
    { name: 'Steve', id: '13' },
    { name: 'Sandy', id: '14' },
    { name: 'Jack', id: '15' },
    { name: 'Judy', id: '16' },
    { name: 'Jeff', id: '17' },
    { name: 'Jen', id: '18' },
    { name: 'Jake', id: '19' },
    { name: 'Julie', id: '20' },
  ];

  public colors: { name: string }[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
  ];

  public characterCounterLimit = 10;
  public showCharacterCounterError: Observable<boolean>;

  public calculatorIds: SkyDateRangeCalculatorId[] | undefined;

  public readonly ready = new BehaviorSubject<boolean>(false);

  #elementRef = inject(ElementRef<HTMLElement>);
  #formBuilder = inject(FormBuilder);
  #subscription = new Subscription();
  #themeSvc = inject(SkyThemeService);

  constructor() {
    this.favoritesForm = this.#formBuilder.group({
      favoriteText: ['Some text'],
      favoriteName: [[this.people[3]]],
      favoritePeople: [[this.people[4], this.people[5]]],
      favoriteWord: ['Example'],
      favoriteColor: ['Turquoise'],
      favoriteCountry: [
        {
          name: 'Trinidad and Tobago',
          iso2: 'tt',
        },
      ],
      favoriteDateRange: [
        {
          calculatorId: SkyDateRangeCalculatorId.SpecificRange,
          startDate: new Date('11/5/1955'),
          endDate: new Date('11/12/1955'),
        },
      ],
      favoriteDate: [new Date('4/25/2000')],
    });
    this.showCharacterCounterError = this.favoritesForm
      .get('favoriteWord')
      ?.valueChanges.pipe(
        map((value) => value?.length > this.characterCounterLimit),
      ) as Observable<boolean>;
  }

  public ngAfterViewInit(): void {
    this.#subscription.add(
      this.#themeSvc.settingsChange
        .pipe(startWith(undefined), delay(300))
        .subscribe(() => {
          Array.from(
            this.#elementRef.nativeElement.querySelectorAll(
              'form .fields-column > div.sky-form-group',
            ),
          ).forEach((element: unknown) => {
            const heightElement = (element as HTMLElement)
              .nextElementSibling as HTMLElement;
            /* istanbul ignore else */
            if (heightElement?.matches('.height-measure')) {
              heightElement.innerText = Array.from(
                (element as HTMLElement).querySelectorAll(
                  'sky-input-box > div.sky-input-box',
                ),
              )
                .map((input: unknown) => {
                  return `${(input as HTMLElement).clientHeight}px`;
                })
                .join(' ');
            } else {
              console.log(`Doesn't match .height-measure`, heightElement);
            }
          });
          if (!this.ready.getValue()) {
            this.ready.next(true);
          }
        }),
    );
  }

  public ngOnDestroy(): void {
    this.ready.complete();
  }

  public onSubmit(): void {
    console.log({ save: this.favoritesForm.value });
  }

  public onAddButtonClicked(): void {
    console.log('Add button clicked');
  }
}
