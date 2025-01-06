import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyDropdownButtonType, SkyDropdownMenuChange } from '@skyux/popovers';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyDropdownFixture } from './dropdown-fixture';
import { SkyDropdownTestingModule } from './dropdown-testing.module';

const DATA_SKY_ID = 'test-dropdown';

//#region Test component
@Component({
  selector: 'sky-dropdown-test',
  template: `
    <sky-dropdown
      data-sky-id="${DATA_SKY_ID}"
      [buttonStyle]="buttonStyle"
      [buttonType]="buttonType"
      [disabled]="disabled"
      [label]="label"
      [title]="title"
    >
      <sky-dropdown-button>
        {{ dropdownButtonText }}
      </sky-dropdown-button>
      <sky-dropdown-menu
        [ariaLabelledBy]="dropdownMenuAriaLabelledBy"
        [ariaRole]="dropdownMenuAriaRole"
        (menuChanges)="onMenuChanges($event)"
      >
        @for (item of items; track item; let i = $index) {
          <sky-dropdown-item [ariaRole]="i === 2 ? 'item-custom-role' : null">
            <button
              type="button"
              [attr.data-test-id]="'my-button-' + i"
              [attr.disabled]="item.disabled ? '' : null"
              (click)="onItemClick()"
            >
              {{ item.name }}
            </button>
          </sky-dropdown-item>
        }
      </sky-dropdown-menu>
    </sky-dropdown>
  `,
  standalone: false,
})
class DropdownTestComponent {
  public activeIndex: number | undefined;

  public buttonStyle: string | undefined;

  public buttonType: SkyDropdownButtonType | undefined;

  public disabled = false;

  public dropdownButtonText = 'Show dropdown';

  public dropdownMenuAriaLabelledBy: string | undefined;

  public dropdownMenuAriaRole: string | undefined;

  public label: string | undefined;

  public title: string | undefined;

  public items: { name: string; disabled?: boolean }[] = [
    { name: 'Option 1' },
    { name: 'Option 2', disabled: true },
    { name: 'Option 3' },
  ];

  public onMenuChanges(itemName: SkyDropdownMenuChange): void {
    if (itemName.activeIndex) {
      this.activeIndex = itemName.activeIndex;
    }
  }

  public onItemClick(): void {}
}
//#endregion Test component

describe('Dropdown fixture', () => {
  let fixture: ComponentFixture<DropdownTestComponent>;
  let testComponent: DropdownTestComponent;
  let dropdownFixture: SkyDropdownFixture;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      declarations: [DropdownTestComponent],
      imports: [SkyDropdownTestingModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    fixture = TestBed.createComponent(DropdownTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    dropdownFixture = new SkyDropdownFixture(fixture, DATA_SKY_ID);
  });

  it('should expose the properties for the dropdown button', () => {
    // Give properties non-default values.
    testComponent.buttonStyle = 'primary';
    testComponent.buttonType = 'context-menu';
    testComponent.disabled = true;
    testComponent.label = 'A11y descriptor';
    testComponent.title = 'my title';
    fixture.detectChanges();

    // Expect new values to be set on sky-dropdown component.
    expect(dropdownFixture.dropdown?.buttonStyle).toEqual(
      testComponent.buttonStyle,
    );
    expect(dropdownFixture.dropdown?.buttonType).toEqual(
      testComponent.buttonType,
    );
    expect(dropdownFixture.dropdown?.disabled).toEqual(testComponent.disabled);
    expect(dropdownFixture.dropdown?.label).toEqual(testComponent.label);
    expect(dropdownFixture.dropdown?.title).toEqual(testComponent.title);
    expect(dropdownFixture.dropdown?.buttonType).toEqual(
      testComponent.buttonType,
    );

    // Check default button styling.
    testComponent.buttonStyle = undefined;
    fixture.detectChanges();
    expect(dropdownFixture.dropdown?.buttonStyle).toEqual('default');

    // Check custom button styling.
    testComponent.buttonStyle = 'invalid';
    fixture.detectChanges();
    expect(dropdownFixture.dropdown?.buttonStyle).toBeUndefined();
  });

  it('should expose the inner text of the dropdown button', () => {
    expect(dropdownFixture.dropdownButtonText).toEqual(
      testComponent.dropdownButtonText,
    );
  });

  it('should open and close the dropdown menu when the dropdown button is clicked', async () => {
    await dropdownFixture.clickDropdownButton();
    expect(dropdownFixture.dropdownMenuIsVisible).toEqual(true);

    await dropdownFixture.clickDropdownButton();
    expect(dropdownFixture.dropdownMenuIsVisible).toEqual(false);
  });

  it('should expose the properties for the dropdown menu', async () => {
    // Give properties non-default values.
    testComponent.dropdownMenuAriaLabelledBy = 'my-custom-id';
    testComponent.dropdownMenuAriaRole = 'my-custom-role';
    fixture.detectChanges();

    await dropdownFixture.clickDropdownButton();

    // Expect new values to be set on sky-dropdown-menu component.
    expect(dropdownFixture.dropdownMenu?.ariaLabelledBy).toEqual(
      testComponent.dropdownMenuAriaLabelledBy,
    );
    expect(dropdownFixture.dropdownMenu?.ariaRole).toEqual(
      testComponent.dropdownMenuAriaRole,
    );
  });

  it('should expose the properties for dropdown items', async () => {
    await dropdownFixture.clickDropdownButton();

    expect(dropdownFixture.getDropdownItem(0)?.ariaRole).toEqual('menuitem');
    expect(dropdownFixture.getDropdownItem(1)?.ariaRole).toEqual('menuitem');
    expect(dropdownFixture.getDropdownItem(2)?.ariaRole).toEqual(
      'item-custom-role',
    );
  });

  it('should allow a dropdown item to be clicked', async () => {
    const clickSpy = spyOn(
      fixture.componentInstance,
      'onItemClick',
    ).and.callThrough();

    await dropdownFixture.clickDropdownButton();
    expect(fixture.componentInstance.activeIndex).toBeUndefined();

    await dropdownFixture.clickDropdownItem(2);
    expect(fixture.componentInstance.activeIndex).toEqual(2);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should return content inside the dropdown menu with getDropdownMenuContent()', async () => {
    await dropdownFixture.clickDropdownButton();

    const menu = dropdownFixture.getDropdownMenuContent();

    expect(menu).not.toBeNull();

    const buttonEls = menu.querySelectorAll('button[data-test-id]');

    expect(buttonEls).not.toBeNull();
    expect(buttonEls.length).toEqual(3);

    expect(buttonEls[0].textContent.trim()).toEqual(
      testComponent.items[0].name,
    );
    expect(buttonEls[0].disabled).toEqual(false);

    expect(buttonEls[1].textContent.trim()).toEqual(
      testComponent.items[1].name,
    );
    expect(buttonEls[1].disabled).toEqual(true);

    expect(buttonEls[2].textContent.trim()).toEqual(
      testComponent.items[2].name,
    );
    expect(buttonEls[2].disabled).toEqual(false);
  });

  it('should handle actions against the dropdown in various states', async () => {
    // Retrieving the dropdown menu when it's not open.
    expect(dropdownFixture.dropdownMenu).toBeUndefined();

    // Clicking an item on an unopened menu.
    await expectAsync(dropdownFixture.clickDropdownItem(0)).toBeResolvedTo(
      undefined,
    );

    // Getting items from a closed menu.
    expect(dropdownFixture.getDropdownItem(0)).toBeUndefined();

    // Open the dropdown for the following expectations.
    await dropdownFixture.clickDropdownButton();

    // Getting a non-existent item.
    expect(() => dropdownFixture.getDropdownItem(999)).toThrowError(
      'There is no dropdown item at index 999.',
    );

    // Clicking a non-existent menu item.
    await expectAsync(
      dropdownFixture.clickDropdownItem(999),
    ).toBeRejectedWithError('There is no dropdown item at index 999.');
  });
});
