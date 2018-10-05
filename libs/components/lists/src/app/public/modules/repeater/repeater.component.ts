import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';

import { SkyRepeaterItemComponent } from './repeater-item.component';
import { SkyRepeaterService } from './repeater.service';

@Component({
  selector: 'sky-repeater',
  styleUrls: ['./repeater.component.scss'],
  templateUrl: './repeater.component.html'
})
export class SkyRepeaterComponent implements AfterContentInit {
  @Input()
  public set expandMode(value: string) {
    this._expandMode = value;
    this.updateForExpandMode();
  }

  public get expandMode(): string {
    return this._expandMode || 'none';
  }

  @ContentChildren(SkyRepeaterItemComponent)
  public items: QueryList<SkyRepeaterItemComponent>;

  private _expandMode = 'none';

  constructor(private repeaterService: SkyRepeaterService) {
    this.repeaterService.itemCollapseStateChange.subscribe((item: SkyRepeaterItemComponent) => {
      if (this.expandMode === 'single' && item.isExpanded) {
        this.items.forEach((otherItem) => {
          if (otherItem !== item && otherItem.isExpanded) {
            otherItem.isExpanded = false;
          }
        });
      }
    });

    this.updateForExpandMode();
  }

  public ngAfterContentInit() {
    // HACK: Not updating for expand mode in a timeout causes an error.
    // https://github.com/angular/angular/issues/6005
    this.items.changes.subscribe(() => {
      setTimeout(() => {
        this.updateForExpandMode(this.items.last);
      }, 0);
    });

    setTimeout(() => {
      this.updateForExpandMode();
    }, 0);
  }

  private updateForExpandMode(itemAdded?: SkyRepeaterItemComponent) {
    if (this.items) {
      let foundExpanded = false;
      let isCollapsible = this.expandMode !== 'none';
      let isSingle = this.expandMode === 'single';

      // Keep any newly-added expanded item expanded and collapse the rest.
      if (itemAdded && itemAdded.isExpanded) {
        foundExpanded = true;
      }

      this.items.forEach((item) => {
        item.isCollapsible = isCollapsible;

        if (item !== itemAdded && isSingle && item.isExpanded) {
          if (foundExpanded) {
            item.updateForExpanded(false, false);
          }

          foundExpanded = true;
        }
      });
    }
  }
}
