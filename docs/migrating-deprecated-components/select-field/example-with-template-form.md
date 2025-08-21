# Example: Migration with Template Forms (NgModel)

This example shows how to migrate `sky-select-field` components that use template-driven forms with `ngModel`.

## Before (sky-select-field with template forms)

```html
<form #userForm="ngForm">
  <div class="form-section">
    <label class="sky-control-label sky-control-label-required">
      Favorite Colors
    </label>
    <sky-select-field
      name="favoriteColors"
      [(ngModel)]="selectedColors"
      [data]="colorsStream"
      pickerHeading="Choose Your Favorite Colors"
      multipleSelectOpenButtonText="Add Colors"
      required
      #colorsField="ngModel"
    >
    </sky-select-field>
    <div
      *ngIf="colorsField.invalid && colorsField.touched"
      class="sky-error-label"
    >
      Please select at least one color.
    </div>
  </div>

  <div class="form-section">
    <label class="sky-control-label"> Primary Language </label>
    <sky-select-field
      name="primaryLanguage"
      [(ngModel)]="selectedLanguage"
      selectMode="single"
      [data]="languagesStream"
      singleSelectPlaceholderText="Select a language"
      pickerHeading="Available Languages"
      #languageField="ngModel"
    >
    </sky-select-field>
  </div>

  <div class="form-section">
    <label class="sky-control-label"> Notification Settings </label>
    <sky-select-field
      name="notifications"
      [(ngModel)]="selectedNotifications"
      [data]="notificationTypesStream"
      (addNewRecordButtonClick)="onAddNotificationType()"
      showAddNewRecordButton="true"
    >
    </sky-select-field>
  </div>

  <button
    type="submit"
    class="sky-btn sky-btn-primary"
    [disabled]="userForm.invalid"
  >
    Save Preferences
  </button>
</form>
```

```typescript
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkySelectFieldModule } from '@skyux/select-field';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  imports: [SkySelectFieldModule, FormsModule, CommonModule],
})
export class UserPreferencesComponent {
  protected selectedColors: any[] = [];
  protected selectedLanguage: any = null;
  protected selectedNotifications: any[] = [];

  protected readonly colorsStream = new BehaviorSubject([
    { id: 'red', label: 'Red' },
    { id: 'blue', label: 'Blue' },
    { id: 'green', label: 'Green' },
    { id: 'purple', label: 'Purple' },
  ]);

  protected readonly languagesStream = new BehaviorSubject([
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Spanish' },
    { id: 'fr', label: 'French' },
  ]);

  protected readonly notificationTypesStream = new BehaviorSubject([
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    { id: 'push', label: 'Push Notifications' },
  ]);

  protected onAddNotificationType() {
    console.log('Add new notification type');
  }
}
```

## After (sky-lookup with template forms)

```html
<form #userForm="ngForm">
  <sky-input-box labelText="Favorite Colors" required>
    <sky-lookup
      name="favoriteColors"
      [(ngModel)]="selectedColors"
      [data]="(colorsStream | async) ?? []"
      descriptorProperty="label"
      idProperty="id"
      enableShowMore
      [showMoreConfig]="{ nativePickerConfig: { title: 'Choose Your Favorite Colors' } }"
      required
      #colorsField="ngModel"
    >
    </sky-lookup>
    @if (colorsField.invalid && colorsField.touched) {
    <div class="sky-error-label">Please select at least one color.</div>
    }
  </sky-input-box>

  <sky-input-box labelText="Primary Language">
    <sky-lookup
      name="primaryLanguage"
      [(ngModel)]="selectedLanguage"
      selectMode="single"
      [data]="(languagesStream | async) ?? []"
      descriptorProperty="label"
      idProperty="id"
      enableShowMore
      placeholderText="Select a language"
      [showMoreConfig]="{ nativePickerConfig: { title: 'Available Languages' } }"
      #languageField="ngModel"
    >
    </sky-lookup>
  </sky-input-box>

  <sky-input-box labelText="Notification Settings">
    <sky-lookup
      name="notifications"
      [(ngModel)]="selectedNotifications"
      [data]="(notificationTypesStream | async) ?? []"
      descriptorProperty="label"
      idProperty="id"
      enableShowMore
      showAddButton
      (addClick)="onAddNotificationType()"
    >
    </sky-lookup>
  </sky-input-box>

  <button
    type="submit"
    class="sky-btn sky-btn-primary"
    [disabled]="userForm.invalid"
  >
    Save Preferences
  </button>
</form>
```

```typescript
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  imports: [SkyLookupModule, SkyInputBoxModule, FormsModule, AsyncPipe],
})
export class UserPreferencesComponent {
  // Multiple select - remains as array
  protected selectedColors: any[] = [];

  // Single select - now must be array, access with [0]
  protected selectedLanguage: any[] = [];

  // Multiple select - remains as array
  protected selectedNotifications: any[] = [];

  protected readonly colorsStream = new BehaviorSubject([
    { id: 'red', label: 'Red' },
    { id: 'blue', label: 'Blue' },
    { id: 'green', label: 'Green' },
    { id: 'purple', label: 'Purple' },
  ]);

  protected readonly languagesStream = new BehaviorSubject([
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Spanish' },
    { id: 'fr', label: 'French' },
  ]);

  protected readonly notificationTypesStream = new BehaviorSubject([
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    { id: 'push', label: 'Push Notifications' },
  ]);

  protected onAddNotificationType() {
    console.log('Add new notification type');
  }

  // Helper method to get the selected language as single object
  protected getSelectedLanguage() {
    return this.selectedLanguage?.[0] || null;
  }
}
```

## Key Changes for Template Forms

1. **NgModel binding**: Remains the same `[(ngModel)]` syntax
2. **Single select handling**: `selectedLanguage` property now must be an array
3. **Template control flow**: Updated to use `@if` instead of `*ngIf`
4. **Module imports**: Added `SkyLookupModule`, `SkyInputBoxModule`, and `AsyncPipe`
5. **Event binding**: `(addNewRecordButtonClick)` becomes `(addClick)`
6. **Data binding**: All data streams use `(stream | async) ?? []` pattern
7. **Validation**: Template reference variables work the same way

## Important Notes

- For single select mode with template forms, the bound property must be an array
- Access the actual selected item using `selectedLanguage[0]`
- The `sky-input-box` now handles all labeling and validation display
- Error messages can still be shown using template reference variables
