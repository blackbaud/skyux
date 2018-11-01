import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  SkyTextExpandRepeaterAdapterService
} from './text-expand-repeater-adapter.service';
import {
  SkyLibResourcesService
} from '@skyux/i18n/modules/i18n';
import { Observable } from 'rxjs/Observable';

/**
 * Auto-incrementing integer used to generate unique ids for text expand repeater components.
 */
let nextId = 0;

@Component({
  selector: 'sky-text-expand-repeater',
  templateUrl: './text-expand-repeater.component.html',
  styleUrls: ['./text-expand-repeater.component.scss'],
  providers: [
    SkyTextExpandRepeaterAdapterService
  ]
})
export class SkyTextExpandRepeaterComponent implements AfterViewInit {
  @Input()
  public maxItems: number;
  @Input()
  public set data(value: Array<any>) {
    this.setup(value);
  }
  public buttonText: string;
  public contentItems: Array<any>;
  public expandable: boolean;
  public contentSectionId: string = `sky-text-expand-repeater-content-${++nextId}`;

  private seeMoreText: string;
  private seeLessText: string;
  private isExpanded: boolean = false;
  @ViewChild('container', { read: ElementRef })
  private containerEl: ElementRef;
  private items: Array<HTMLElement>;

  constructor(
    private resources: SkyLibResourcesService,
    private elRef: ElementRef,
    private textExpandRepeaterAdapter: SkyTextExpandRepeaterAdapterService,
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngAfterViewInit() {
    if (this.contentItems) {
      this.items = this.textExpandRepeaterAdapter.getItems(this.elRef);
      for (let i = this.maxItems; i < this.contentItems.length; i++) {
        this.textExpandRepeaterAdapter.hideItem(this.items[i]);
      }
    }

    Observable.forkJoin(this.resources.getString('skyux_text_expand_see_more'),
      this.resources.getString('skyux_text_expand_see_less')).take(1).subscribe(resources => {
        this.seeMoreText = resources[0];
        this.seeLessText = resources[1];
        /* sanity check */
        /* istanbul ignore else */
        if (!this.isExpanded) {
          this.buttonText = this.seeMoreText;
        } else {
          this.buttonText = this.seeLessText;
        }
        this.changeDetector.detectChanges();
      });
  }

  public animationEnd() {
    // Ensure the correct items are displayed
    if (!this.isExpanded) {
      for (let i = this.maxItems; i < this.contentItems.length; i++) {
        this.textExpandRepeaterAdapter.hideItem(this.items[i]);
      }
    }
    // Set height back to auto so the browser can change the height as needed with window changes
    this.textExpandRepeaterAdapter.setContainerHeight(this.containerEl, undefined);
  }

  public repeaterExpand() {
    if (!this.isExpanded) {
      this.setContainerMaxHeight();
      setTimeout(() => {
        this.isExpanded = true;
        this.animateRepeater(true);
      });

    } else {
      this.setContainerMaxHeight();
      setTimeout(() => {
        this.isExpanded = false;
        this.animateRepeater(false);
      });

    }
  }

  private setContainerMaxHeight() {
    // ensure everything is reset
    this.animationEnd();
    /* Before animation is kicked off, ensure that a maxHeight exists */
    /* Once we have support for angular v4 animations with parameters we can use that instead */
    let currentHeight = this.textExpandRepeaterAdapter.getContainerHeight(this.containerEl);
    this.textExpandRepeaterAdapter.setContainerHeight(this.containerEl, `${currentHeight}px`);
  }

  private animateRepeater(expanding: boolean) {
    let adapter = this.textExpandRepeaterAdapter;
    let container = this.containerEl;

    adapter.setContainerHeight(container, undefined);
    let currentHeight = adapter.getContainerHeight(container);
    for (let i = this.maxItems; i < this.contentItems.length; i++) {
      if (!expanding) {
        adapter.hideItem(this.items[i]);
      } else {
        adapter.showItem(this.items[i]);
      }
    }
    let newHeight = adapter.getContainerHeight(container);
    if (!expanding) {
      this.buttonText = this.seeMoreText;
    } else {
      this.buttonText = this.seeLessText;
    }
    if (newHeight < currentHeight) {
      // The new text is smaller than the old text, so put the old text back before doing
      // the collapse animation to avoid showing a big chunk of whitespace.
      for (let i = this.maxItems; i < this.contentItems.length; i++) {
        adapter.showItem(this.items[i]);
      }
    }

    adapter.setContainerHeight(container, `${currentHeight}px`);
    // This timeout is necessary due to the browser needing to pick up the non-auto height being set
    // in order to do the transtion in height correctly. Without it the transition does not fire.
    setTimeout(() => {
      adapter.setContainerHeight(container, `${newHeight}px`);
      /* This resets values if the transition does not get kicked off */
      setTimeout(() => {
        this.animationEnd();
      }, 500);
    }, 10);
  }

  private setup(value: Array<any>) {
    if (value) {
      let length = value.length;
      if (length > this.maxItems) {
        this.expandable = true;
        this.buttonText = this.seeMoreText;
        this.isExpanded = false;
      } else {
        this.expandable = false;
      }
      this.contentItems = value;
    } else {
      this.contentItems = undefined;
      this.expandable = false;
    }
  }
}
