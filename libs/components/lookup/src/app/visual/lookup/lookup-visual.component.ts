import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyLookupVisualCustomPickerComponent
} from './lookup-visual-custom-picker.component';

import {
  SkyLookupSelectMode,
  SkyLookupShowMoreCustomPickerContext,
  SkyLookupShowMoreConfig
} from '../../public/public_api';

@Component({
  selector: 'lookup-visual',
  templateUrl: './lookup-visual.component.html',
  styleUrls: ['./lookup-visual.component.scss']
})
export class LookupVisualComponent implements OnInit {
  public friendsForm: FormGroup;
  public bestFriendsForm: FormGroup;
  public showMoreConfig: SkyLookupShowMoreConfig = {};

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
    { id: 21, name: 'Zack' }
  ];

  public friends: any[] = [
    { id: 16, name: 'Susan' },
    { id: 21, name: 'Zack' }
  ];

  public friends2: any[] = [
    { id: 16, name: 'Susan' },
    { id: 21, name: 'Zack' }
  ];

  public bestFriend: any[] = [
    { id: 16, name: 'Susan' }
  ];

  public bestFriendSelectMode: SkyLookupSelectMode = SkyLookupSelectMode.single;

  @ViewChild('itemTemplate2')
  public set modalItemTemplate(itemTemplate: TemplateRef<any>) {
    this.showMoreConfig.nativePickerConfig = {
      itemTemplate: itemTemplate
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService,
    private modalService: SkyModalService,
    private changeDetector: ChangeDetectorRef
  ) { }

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

  public toggleCustomPicker(): void {
    if (this.showMoreConfig.customPicker) {
      this.showMoreConfig.customPicker = undefined;
    } else {
      this.showMoreConfig.customPicker = {
        open: (context: SkyLookupShowMoreCustomPickerContext) => {
          const instance = this.modalService.open(SkyLookupVisualCustomPickerComponent, {
            providers: [
              {
                provide: SkyLookupShowMoreCustomPickerContext,
                useValue: context
              }
            ]
          });

          instance.closed.subscribe((closeArgs: SkyModalCloseArgs) => {
            if (closeArgs.reason === 'save') {
              if (closeArgs.data) {
                this.bestFriendsForm
                  .setValue({ 'bestFriend': [this.people[this.people.length - 1]] });
                this.changeDetector.markForCheck();
              }
            }
          });
        }
      };
    }
  }

  public toggleSelectMode(): void {
    this.bestFriendSelectMode = this.bestFriendSelectMode === SkyLookupSelectMode.single ?
      SkyLookupSelectMode.multiple : SkyLookupSelectMode.single;
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }

  private createForms(): void {
    this.friendsForm = this.formBuilder.group({
      friends: new FormControl(this.friends),
      friends2: new FormControl(this.friends2)
    });

    this.bestFriendsForm = this.formBuilder.group({
      bestFriend: new FormControl(this.bestFriend)
    });
  }
}
