import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyLookupSelectModeType,
  SkyLookupShowMoreConfig,
  SkyLookupShowMoreCustomPickerContext,
} from '@skyux/lookup';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LookupCustomPickerComponent } from './lookup-custom-picker.component';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
})
export class LookupComponent implements OnInit {
  public friendsForm: FormGroup;
  public bestFriendsForm: FormGroup;
  public showMoreConfig: SkyLookupShowMoreConfig = {};
  public disabled = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public people: any[] = [
    { id: 1, name: 'Andy' },
    { id: 2, name: 'Beth' },
    { id: 3, name: 'David' },
    { id: 4, name: 'Frank' },
    { id: 5, name: 'Grace' },
    { id: 6, name: 'Isaac' },
    { id: 7, name: 'John' },
    { id: 8, name: 'Jupiter' },
    { id: 9, name: 'Joyce' },
    { id: 10, name: 'Lindsey' },
    { id: 11, name: 'Mitch' },
    { id: 12, name: 'Patty' },
    { id: 13, name: 'Paul' },
    { id: 14, name: 'Quincy' },
    { id: 15, name: 'Sally' },
    { id: 16, name: 'Susan' },
    { id: 17, name: 'Vanessa' },
    { id: 18, name: 'Winston' },
    { id: 19, name: 'Xavier' },
    { id: 20, name: 'Yolanda' },
    { id: 21, name: 'Zack' },
  ];

  public friends: any[] = [this.people[15], this.people[20]];

  public friends2: any[] = [this.people[15], this.people[20]];

  public bestFriend: any[] = [this.people[15]];

  public bestFriendSelectMode: SkyLookupSelectModeType = 'single';

  @ViewChild('itemTemplate2')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set modalItemTemplate(itemTemplate: TemplateRef<any>) {
    this.showMoreConfig.nativePickerConfig = {
      itemTemplate: itemTemplate,
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalService: SkyModalService,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.createForms();
  }

  public addButtonClicked(): void {
    console.log('Add Button Clicked!');
  }

  public enableLookup(): void {
    this.friendsForm.controls.friends.enable();
  }

  public disableLookup(): void {
    this.friendsForm.controls.friends.disable();
  }

  public onResetValueClick(): void {
    this.bestFriendsForm.get('bestFriend').setValue(undefined);
  }

  public toggleCustomPicker(): void {
    if (this.showMoreConfig.customPicker) {
      this.showMoreConfig.customPicker = undefined;
    } else {
      this.showMoreConfig.customPicker = {
        open: (context: SkyLookupShowMoreCustomPickerContext) => {
          const instance = this.modalService.open(LookupCustomPickerComponent, {
            providers: [
              {
                provide: SkyLookupShowMoreCustomPickerContext,
                useValue: context,
              },
            ],
          });

          instance.closed.subscribe((closeArgs: SkyModalCloseArgs) => {
            if (closeArgs.reason === 'save') {
              if (closeArgs.data) {
                this.bestFriendsForm.setValue({
                  bestFriend: [this.people[this.people.length - 1]],
                });
                this.changeDetector.markForCheck();
              }
            }
          });
        },
      };
    }
  }

  public toggleSelectMode(): void {
    this.bestFriendSelectMode =
      this.bestFriendSelectMode === 'single' ? 'multiple' : 'single';
  }

  public bestFriendSearch(args: SkyAutocompleteSearchAsyncArgs): void {
    const searchText = (args.searchText || '').toLowerCase();

    let items = this.people.filter(
      (item) => item.name.toLowerCase().indexOf(searchText) >= 0
    );

    const totalCount = items.length;
    let hasMore = false;
    const itemCountToReturn = args.displayType === 'popover' ? 5 : 10;

    items = items.slice(args.offset, args.offset + itemCountToReturn);
    hasMore = args.offset + itemCountToReturn < totalCount;

    // Simulate new object instances being returned by a web service call.
    items = items.map((item) => Object.assign({}, item));

    args.result = of({
      hasMore,
      items,
      totalCount,
    }).pipe(delay(1000));
  }

  private createForms(): void {
    this.friendsForm = this.formBuilder.group({
      friends: new FormControl(this.friends),
      friends2: new FormControl(this.friends2),
    });

    this.bestFriendsForm = this.formBuilder.group({
      bestFriend: new FormControl(this.bestFriend),
      bestFriendAsync: undefined,
    });
  }
}
