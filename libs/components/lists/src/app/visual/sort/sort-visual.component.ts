import {
  Component
} from '@angular/core';

import {
  SkyThemeService,
  SkyThemeSettings
} from '@skyux/theme';

@Component({
  selector: 'sort-visual',
  templateUrl: './sort-visual.component.html'
})
export class SortVisualComponent {
  public initialState = 3;
  public sortOptions = [
    {
      id: 1,
      label: 'Assigned to (A - Z)',
      name: 'assignee',
      descending: false
    },
    {
      id: 2,
      label: 'Assigned to (Z - A)',
      name: 'assignee',
      descending: true
    },
    {
      id: 3,
      label: 'Date created (newest first)',
      name: 'date',
      descending: true
    },
    {
      id: 4,
      label: 'Date created (oldest first)',
      name: 'date',
      descending: false
    },
    {
      id: 5,
      label: 'Note title (A - Z)',
      name: 'title',
      descending: false
    },
    {
      id: 6,
      label: 'Note title (Z - A)',
      name: 'title',
      descending: true
    }
  ];

  public sortedItem: any;

  constructor(
    public themeSvc: SkyThemeService
  ) {
  }

  public sortItems(item: any) {
    this.sortedItem = item;
  }

  public themeSettingsChange(themeSettings: SkyThemeSettings): void {
    this.themeSvc.setTheme(themeSettings);
  }
}
