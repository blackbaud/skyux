import {
  async,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';

import {
  Component
} from '@angular/core';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyDropdownMenuChange,
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyDropdownFixture
} from './dropdown-fixture';

const DATA_SKY_ID = 'test-dropdown';

//#region Test component
@Component({
  selector: 'dropdown-test',
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
    <sky-dropdown-item *ngFor="let item of items; index as i"
      [ariaRole]="i === 2 ? 'item-custom-role' : null"
    >
      <button
        type="button"
        [attr.data-test-id]="'my-button-' + i"
        [attr.disabled]="item.disabled ? '' : null"
      >
        {{ item.name }}
      </button>
    </sky-dropdown-item>
  </sky-dropdown-menu>
</sky-dropdown>
`
})
class DropdownTestComponent {

  public activeIndex: number;

  public buttonStyle: string;

  public buttonType: string;

  public disabled: boolean = false;

  public dropdownButtonText: string = 'Show dropdown';

  public dropdownMenuAriaLabelledBy: string;

  public dropdownMenuAriaRole: string;

  public label: string;

  public title: string;

  public items: any[] = [
    { name: 'Option 1' },
    { name: 'Option 2', disabled: true },
    { name: 'Option 3' }
  ];

  public onMenuChanges(itemName: SkyDropdownMenuChange): void {
    if (itemName.activeIndex) {
      this.activeIndex = itemName.activeIndex;
    }
  }

}
//#endregion Test component

describe('Dropdown fixture', () => {
  let fixture: ComponentFixture<DropdownTestComponent>;
  let testComponent: DropdownTestComponent;
  let dropdownFixture: SkyDropdownFixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropdownTestComponent
      ],
      imports: [
        SkyDropdownModule
      ]
    });

    fixture = TestBed.createComponent(
      DropdownTestComponent
    );
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    dropdownFixture = new SkyDropdownFixture(fixture, DATA_SKY_ID);
  });

  it('should expose the properties for the dropdown button', async(() => {
    // Give properties non-default values.
    testComponent.buttonStyle = 'primary';
    testComponent.buttonType = 'context-menu';
    testComponent.disabled = true;
    testComponent.label = 'A11y descriptor';
    testComponent.title = 'my tile';
    fixture.detectChanges();

    // Expect new values to be set on sky-dropdown component.
    expect(dropdownFixture.dropdown.buttonStyle).toEqual(testComponent.buttonStyle);
    expect(dropdownFixture.dropdown.buttonType).toEqual(testComponent.buttonType);
    expect(dropdownFixture.dropdown.disabled).toEqual(testComponent.disabled);
    expect(dropdownFixture.dropdown.label).toEqual(testComponent.label);
    expect(dropdownFixture.dropdown.title).toEqual(testComponent.title);
    expect(dropdownFixture.dropdown.buttonType).toEqual(testComponent.buttonType);
  }));

  it('should expose the inner text of the dropdown button', async(() => {
    expect(dropdownFixture.dropdownButtonText).toEqual(testComponent.dropdownButtonText);
  }));

  it('should open and close the dropdown menu when the dropdown button is clicked', async() => {
    await dropdownFixture.clickDropdownButton();
    expect(dropdownFixture.dropdownMenuIsVisible).toEqual(true);

    await dropdownFixture.clickDropdownButton();
    expect(dropdownFixture.dropdownMenuIsVisible).toEqual(false);
  });

  it('should expose the properties for the dropdown menu', async() => {
    // Give properties non-default values.
    testComponent.dropdownMenuAriaLabelledBy = 'my-custom-id';
    testComponent.dropdownMenuAriaRole = 'my-custom-role';
    fixture.detectChanges();

    await dropdownFixture.clickDropdownButton();

    // Expect new values to be set on sky-dropdown-menu component.
    expect(dropdownFixture.dropdownMenu.ariaLabelledBy)
      .toEqual(testComponent.dropdownMenuAriaLabelledBy);
    expect(dropdownFixture.dropdownMenu.ariaRole)
      .toEqual(testComponent.dropdownMenuAriaRole);
  });

  it('should expose the properties for dropdown items', async() => {
    await dropdownFixture.clickDropdownButton();

    expect(dropdownFixture.getDropdownItem(0).ariaRole).toEqual('menuitem');
    expect(dropdownFixture.getDropdownItem(1).ariaRole).toEqual('menuitem');
    expect(dropdownFixture.getDropdownItem(2).ariaRole).toEqual('item-custom-role');
  });

  it('should allow a dropdown item to be clicked', async() => {
    await dropdownFixture.clickDropdownButton();
    expect(fixture.componentInstance.activeIndex).toBeUndefined();

    await dropdownFixture.clickDropdownItem(2);
    expect(fixture.componentInstance.activeIndex).toEqual(2);
  });

  it('should return content inside the dropdown menu with getDropdownMenuContent()', async() => {
    await dropdownFixture.clickDropdownButton();

    const menu = dropdownFixture.getDropdownMenuContent();

    expect(menu).not.toBeNull();

    const buttonEls = menu.querySelectorAll('button[data-test-id]');

    expect(buttonEls).not.toBeNull();
    expect(buttonEls.length).toEqual(3);

    expect(buttonEls[0].textContent.trim()).toEqual(testComponent.items[0].name);
    expect(buttonEls[0].disabled).toEqual(false);

    expect(buttonEls[1].textContent.trim()).toEqual(testComponent.items[1].name);
    expect(buttonEls[1].disabled).toEqual(true);

    expect(buttonEls[2].textContent.trim()).toEqual(testComponent.items[2].name);
    expect(buttonEls[2].disabled).toEqual(false);
  });
});
