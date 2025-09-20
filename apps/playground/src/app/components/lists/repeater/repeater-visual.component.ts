import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
} from '@skyux/inline-form';
import { SkyFluidGridModule, SkyInlineDeleteModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

let nextItemId = 0;

@Component({
  selector: 'app-repeater-visual',
  templateUrl: './repeater-visual.component.html',
  styleUrls: ['./repeater-visual.component.scss'],
  standalone: false,
})
export class RepeaterVisualComponent {
  public activeIndex = 0;

  public activeInlineFormId: number;

  public customConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.Custom,
    buttons: [
      { action: 'save', text: 'Save', styleType: 'primary' },
      { action: 'delete', text: 'Delete', styleType: 'default' },
      { action: 'reset', text: 'Reset', styleType: 'default' },
      { action: 'cancel', text: 'Cancel', styleType: 'link' },
    ],
  };

  public items = [
    {
      id: 1,
      title: '2018 Gala',
      note: '2018 Gala for friends and family',
      fund: 'General 2018 Fund',
    },
    {
      id: 'foobar',
      title: '2018 Special event',
      note: 'Special event',
      fund: '2018 Special Events Fund',
    },
    {
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund',
    },
    {
      id: 99,
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund',
    },
    {
      id: 123,
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund',
    },
  ];

  public itemsForSelectableRepeater = [
    {
      id: '1',
      title: 'Title 1',
      content: 'Content 1',
      isSelected: false,
    },
    {
      id: '2',
      title: 'Title 2',
      content: 'Content 2',
      isSelected: false,
    },
  ];

  public get itemsForReorderableRepeaterWithAddButton(): UntypedFormArray {
    if (typeof this._itemsForReorderableRepeaterWithAddButton === 'undefined') {
      this._itemsForReorderableRepeaterWithAddButton = new UntypedFormArray(
        Array.from(Array(5).keys()).map((n) =>
          this.newItemForReorderableRepeaterWithAddButton(n + 1),
        ),
      );
    }
    return this._itemsForReorderableRepeaterWithAddButton as UntypedFormArray;
  }

  public _itemsForReorderableRepeaterWithAddButton:
    | UntypedFormArray
    | undefined;

  public reorderable = true;

  public showActiveInlineDelete = false;

  public showContent = false;

  public showStandardInlineDelete = false;

  public showRoles = false;

  public deleteItem(index: number): void {
    this.items.splice(index, 1);

    // If active item is removed, try selecting the next item.
    // If there's not one, try selecting the previous one.
    if (index === this.activeIndex) {
      this.activeIndex = undefined;
      setTimeout(() => {
        if (this.items[index]) {
          this.activeIndex = index;
        } else if (this.items[index - 1]) {
          this.activeIndex = index - 1;
        }
      });
    }
  }

  public addItem(): void {
    const newItem = {
      id: nextItemId++,
      title: 'New record ' + nextItemId,
      note: 'This is a new record',
      fund: 'New fund',
    };
    this.items.push(newItem);
  }

  public addItemToReorderableRepeaterWithAddButton(): void {
    this.itemsForReorderableRepeaterWithAddButton.push(
      this.newItemForReorderableRepeaterWithAddButton(
        this._itemsForReorderableRepeaterWithAddButton.length + 1,
      ),
    );
  }

  public onOrderChange(tags: unknown): void {
    console.log(tags);
  }

  public onOrderChangeForReorderableRepeaterWithAddButton(
    tags: UntypedFormControl[],
  ): void {
    console.log(tags);
    this.itemsForReorderableRepeaterWithAddButton.clear();
    tags.forEach((formControl) => {
      this.itemsForReorderableRepeaterWithAddButton.push(formControl);
    });
  }

  public getSelectedItems(): string[] {
    return this.itemsForSelectableRepeater
      .filter((item) => item.isSelected)
      .map((item) => item.id.toString());
  }

  public onCollapse(): void {
    console.log('Collapsed.');
  }

  public onExpand(): void {
    console.log('Expanded.');
  }

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    console.log(inlineFormCloseArgs);
    this.activeInlineFormId = undefined;

    // Form handling would go here
  }

  public onItemClick(index: number): void {
    this.activeIndex = index;
  }

  public onEnter(event: KeyboardEvent, index: number): void {
    this.onItemClick(index);
  }

  public onSpace(event: KeyboardEvent, index: number): void {
    this.onItemClick(index);
  }

  public hideActiveInlineDelete(): void {
    this.showActiveInlineDelete = false;
  }

  public hideStandardInlineDelete(): void {
    this.showStandardInlineDelete = false;
  }

  public triggerActiveInlineDelete(): void {
    this.showActiveInlineDelete = true;
  }

  public triggerStandardInlineDelete(): void {
    this.showStandardInlineDelete = true;
  }

  private newItemForReorderableRepeaterWithAddButton(
    n: number,
  ): UntypedFormControl {
    return new UntypedFormControl(`item ${n}`, [
      Validators.required,
      Validators.maxLength(20),
    ]);
  }
}

@NgModule({
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyInlineDeleteModule,
    SkyInputBoxModule,
    SkyRepeaterModule,
    SkyThemeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [RepeaterVisualComponent],
  exports: [RepeaterVisualComponent],
})
export class RepeaterVisualComponentModule {}
