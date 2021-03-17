import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

import {
  SkyLookupSelectMode
} from '../../public/public_api';

@Component({
  selector: 'lookup-visual',
  templateUrl: './lookup-visual.component.html'
})
export class LookupVisualComponent implements OnInit {
  public friendsForm: FormGroup;
  public bestFriendsForm: FormGroup;

  public people: any[] = [
    { id: 1, name: 'Andy' },
    { id: 2, name: 'Beth' },
    { id: 3, name: 'David' },
    { id: 4, name: 'Frank' },
    { id: 5, name: 'Grace' },
    { id: 6, name: 'Isaac' },
    { id: 7, name: 'John' },
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

  constructor(
    private formBuilder: FormBuilder,
    private themeSvc: SkyThemeService
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
