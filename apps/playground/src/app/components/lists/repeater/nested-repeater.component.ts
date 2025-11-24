import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { SkyRepeaterModule } from '@skyux/lists';

interface ListItem {
  label: string;
  reorderable?: boolean;
  selectable?: boolean;
  children?: ListItem[];
}

@Component({
  selector: 'app-nested-repeater',
  templateUrl: './nested-repeater.component.html',
  styles: [
    `
      .sky-repeater {
        position: relative;
      }

      .sky-repeater::before {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 140px;
        background: lightgray;
        border: 2px solid slategray;
        color: slategray;
        padding: 2px 4px;
        content: attr(role);
        z-index: 10;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class NestedRepeaterComponent {
  public list: ListItem[] = [
    {
      label: `Item 1`,
      children: Array.from(Array(3).keys()).map((i) => {
        return { label: `Detail ${String.fromCharCode(65 + i)}` };
      }),
      selectable: true,
    },
    {
      label: `Item 2`,
      children: Array.from(Array(2).keys()).map((i) => {
        return {
          label: `Detail ${String.fromCharCode(65 + i + 3)}`,
          reorderable: true,
          children: Array.from(Array(6).keys()).map((i) => {
            return { label: `Note ${1 + i}`, reorderable: true };
          }),
        };
      }),
      selectable: true,
    },
    {
      label: `Item 3`,
      children: Array.from(Array(5).keys()).map((i) => {
        return {
          label: `Detail ${String.fromCharCode(65 + i + 5)}`,
          selectable: true,
        };
      }),
      selectable: true,
    },
  ];
}

@NgModule({
  imports: [SkyRepeaterModule, NgTemplateOutlet],
  declarations: [NestedRepeaterComponent],
  exports: [NestedRepeaterComponent],
})
export class NestedRepeaterComponentModule {}
