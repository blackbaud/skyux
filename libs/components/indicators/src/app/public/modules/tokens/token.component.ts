import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'sky-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTokenComponent {
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return (this._disabled === true);
  }

  @Input()
  public set ariaLabel(value: string) {
    this._ariaLabel = value;
  }
  public get ariaLabel() {
    return this._ariaLabel || this.getString('sky_tokens_dismiss_button_title');
  }

  @Input()
  public set dismissible(value: boolean) {
    this._dismissible = value;
  }

  public get dismissible(): boolean {
    return (this._dismissible !== false);
  }

  @Input()
  public set focusable(value: boolean) {
    this._focusable = value;
  }

  public get focusable(): boolean {
    return (this._focusable !== false);
  }

  @Output()
  public dismiss = new EventEmitter<void>();

  @Output()
  public tokenFocus = new EventEmitter<void>();

  public get tabIndex(): number | boolean {
    return (this.focusable) ? 0 : -1;
  }

  // TODO: The following require statement is not recommended, but was done
  // to avoid a breaking change (SkyResources is synchronous, but SkyAppResources is asynchronous).
  // We should switch to using SkyAppResources in the next major release.
  private resources: any = require('!json-loader!.skypageslocales/resources_en_US.json');

  private _ariaLabel: string;
  private _disabled: boolean;
  private _dismissible: boolean;
  private _focusable: boolean;

  constructor(
    private elementRef: ElementRef
  ) { }

  public dismissToken() {
    this.dismiss.emit();
  }

  public focusElement() {
    this.elementRef.nativeElement.querySelector('.sky-token').focus();
  }

  /**
   * This method is a stand-in for the old SkyResources service from skyux2.
   * TODO: We should consider using Builder's resources service instead.
   * @param key
   */
  private getString(key: string): string {
    return this.resources[key].message;
  }
}
