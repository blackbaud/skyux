import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output
} from '@angular/core';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyTabsetStyle
} from './tabset-style';

/**
 * @internal
 */
@Component({
  selector: 'sky-tab-button',
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  public buttonTextCount: string;

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

  constructor(
    @Optional() public themeSvc?: SkyThemeService
  ) { }

  public onButtonClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.buttonClick.emit();
      event.preventDefault();
    }
  }

  public onButtonEnterKeyDown(event: any): void {
    this.onButtonClick(event);
  }

  public onCloseClick(event: any): void {
    this.closeClick.emit();

    // Prevent the click event from bubbling up to the anchor tag;
    // otherwise it will trigger a page refresh.
    event.stopPropagation();
    event.preventDefault();
  }
}
