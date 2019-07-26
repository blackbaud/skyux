import {
  Component
} from '@angular/core';

import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from '@skyux/inline-form';

let nextItemId: number = 0;

@Component({
  selector: 'repeater-visual',
  templateUrl: './repeater-visual.component.html',
  styleUrls: ['./repeater-visual.component.scss']
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
      { action: 'cancel', text: 'Cancel', styleType: 'link' }
    ]
  };

  public items = [
    {
      id: 1,
      title: '2018 Gala',
      note: '2018 Gala for friends and family',
      fund: 'General 2018 Fund'
    },
    {
      id: 'foobar',
      title: '2018 Special event',
      note: 'Special event',
      fund: '2018 Special Events Fund'
    },
    {
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund'
    },
    {
      id: 99,
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund'
    },
    {
      id: 123,
      title: '2019 Gala',
      note: '2019 Gala for friends and family',
      fund: 'General 2019 Fund'
    }
  ];

  public deleteItem(index: any): void {
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
      fund: 'New fund'
    };
    this.items.push(newItem);
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
}
