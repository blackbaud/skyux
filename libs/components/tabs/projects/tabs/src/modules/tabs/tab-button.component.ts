import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { SkyTabsetStyle } from './tabset-style';

/**
 * @internal
 */
@Component({
  selector: 'sky-tab-button',
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SkyTabButtonComponent {
  @Input()
  public active: boolean;

  @Input()
  public ariaControls: string;

  @Input()
  public buttonHref: string;

  @Input()
  public buttonId: string;

  @Input()
  public buttonText: string;

  @Input()
  public buttonTextCount: string | undefined;

  @Input()
  public closeable: boolean;

  @Input()
  public disabled: boolean;

  @Input()
  public tabStyle: SkyTabsetStyle;

  @Output()
  public buttonClick = new EventEmitter<void>();

  @Output()
  public closeClick = new EventEmitter<void>();

  public onButtonClick(event: any): void {
    if (!this.disabled) {
      this.buttonClick.emit();
      event.preventDefault();
    }
  }

  public onTabButtonKeyDown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toUpperCase()) {
        case ' ':
        case 'ENTER':
          this.onButtonClick(event);
          break;
        /* istanbul ignore next */
        default:
          break;
      }
    }
  }

  public onCloseClick(event: any): void {
    this.closeClick.emit();

    // Prevent the click event from bubbling up to the anchor tag;
    // otherwise it will trigger a page refresh.
    event.stopPropagation();
    event.preventDefault();
  }
}
