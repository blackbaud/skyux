import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'sky-tab-button',
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss']
})
export class SkyTabButtonComponent {
  @Input()
  public tabHeading: string;

  @Input()
  public tabHeaderCount: number;

  @Input()
  public tabStyle: string;

  @Input()
  public active: boolean;

  @Input()
  public allowClose: boolean;

  @Input()
  public disabled: boolean;

  @Output()
  public tabClick = new EventEmitter<any>();

  @Output()
  public closeClick = new EventEmitter<any>();

  public doTabClick() {
    if (!this.disabled) {
      this.tabClick.emit(undefined);
    }
  }

  public doCloseClick() {
    this.closeClick.emit(undefined);
  }

  public keyDownFunction(event: any) {
    if (event.keyCode === 13) {
      this.doTabClick();
    }
  }
}
