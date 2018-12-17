import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import {
  SkyToken
} from './types/token';

import {
  SkyTokensMessage
} from './types/tokens-message';

import {
  SkyTokensMessageType
} from './types/tokens-message-type';

import {
  SkyTokenSelectedEventArgs
} from './types/token-selected-event-args';

import {
  SkyTokenComponent
} from './token.component';

@Component({
  selector: 'sky-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTokensComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return !!this._disabled;
  }

  @Input()
  public set dismissible(value: boolean) {
    this._dismissible = value;
  }

  public get dismissible(): boolean {
    return (this._dismissible !== false);
  }

  @Input()
  public set displayWith(value: string) {
    this._displayWith = value;
  }

  public get displayWith(): string {
    return this._displayWith || 'name';
  }

  @Input()
  public set focusable(value: boolean) {
    this._focusable = value;
  }

  public get focusable(): boolean {
    return (this._focusable !== false);
  }

  @Input()
  public set tokens(value: SkyToken[]) {
    this._tokens = value;
    this.tokensChange.emit(this._tokens);
  }

  public get tokens(): SkyToken[] {
    return this._tokens || [];
  }

  @Input()
  public messageStream = new Subject<SkyTokensMessage>();

  @Output()
  public tokensChange = new EventEmitter<SkyToken[]>();

  @Output()
  public focusIndexOverRange = new EventEmitter<void>();

  @Output()
  public focusIndexUnderRange = new EventEmitter<void>();

  @Output()
  public tokenSelected = new EventEmitter<SkyTokenSelectedEventArgs>();

  public get activeIndex(): number {
    return this._activeIndex || 0;
  }
  public set activeIndex(value: number) {
    if (value >= this.tokens.length) {
      value = this.tokens.length - 1;
      this.focusIndexOverRange.emit();
    }

    if (value < 0) {
      value = 0;
      this.focusIndexUnderRange.emit();
    }

    this._activeIndex = value;
  }

  @ViewChildren(SkyTokenComponent)
  private tokenComponents: QueryList<SkyTokenComponent>;

  private ngUnsubscribe = new Subject();

  private _activeIndex: number;
  private _disabled: boolean;
  private _dismissible: boolean;
  private _focusable: boolean;
  private _tokens: SkyToken[];
  private _displayWith: string;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    if (this.messageStream) {
      this.initMessageStream();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.messageStream &&
      changes.messageStream.currentValue &&
      !changes.messageStream.firstChange
    ) {
      this.initMessageStream();
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    if (this.messageStream) {
      this.messageStream.complete();
    }
  }

  public onTokenClick(token: SkyToken): void {
    if (this.disabled) {
      return;
    }

    this.notifyTokenSelected(token);
  }

  public onTokenKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    if (this.disabled) {
      return;
    }

    /* tslint:disable-next-line:switch-default */
    switch (key) {
      case 'left':
      case 'arrowleft':
      this.messageStream.next({ type: SkyTokensMessageType.FocusPreviousToken });
      event.preventDefault();
      break;

      case 'right':
      case 'arrowright':
      this.messageStream.next({ type: SkyTokensMessageType.FocusNextToken });
      event.preventDefault();
      break;
    }
  }

  public selectToken(token: SkyToken): void {
    if (this.disabled) {
      return;
    }

    this.notifyTokenSelected(token);
  }

  public removeToken(token: SkyToken): void {
    this.tokens = this.tokens.filter(t => t !== token);
    this.changeDetector.detectChanges();
  }

  private focusPreviousToken(): void {
    this.activeIndex--;
    this.focusActiveToken();
  }

  private focusNextToken(): void {
    this.activeIndex++;
    this.focusActiveToken();
  }

  private focusLastToken(): void {
    this.activeIndex = this.tokenComponents.length - 1;
    this.focusActiveToken();
  }

  private focusActiveToken(): void {
    const tokenComponent = this.tokenComponents
      .find((comp: SkyTokenComponent, i: number) => {
        return (this.activeIndex === i);
      });

    if (tokenComponent) {
      tokenComponent.focusElement();
    }
  }

  private removeActiveToken(): void {
    const token = this.tokens[this.activeIndex];
    if (token) {
      this.removeToken(token);
    }
  }

  private initMessageStream(): void {
    this.messageStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((message: SkyTokensMessage) => {
        /* tslint:disable-next-line:switch-default */
        switch (message.type) {
          case SkyTokensMessageType.FocusLastToken:
          this.focusLastToken();
          break;

          case SkyTokensMessageType.FocusActiveToken:
          this.focusActiveToken();
          break;

          case SkyTokensMessageType.FocusPreviousToken:
          this.focusPreviousToken();
          break;

          case SkyTokensMessageType.FocusNextToken:
          this.focusNextToken();
          break;

          case SkyTokensMessageType.RemoveActiveToken:
          this.removeActiveToken();
          break;
        }
      });
  }

  private notifyTokenSelected(token: SkyToken): void {
    this.tokenSelected.emit({
      token
    });
  }
}
