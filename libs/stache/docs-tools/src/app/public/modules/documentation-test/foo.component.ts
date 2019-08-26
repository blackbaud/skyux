import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  FooEnum
} from './foo-enum';

/**
 * This is the description for FooComponent.
 * @example
 * ```
 * <app-foo [baz]="true"></app-foo>
 * ```
 */
@Component({
  selector: 'app-foo',
  template: ''
})
export class FooComponent implements OnInit {

  /**
   * This is the description for foo input. You must provide [[FooEnum]] values.
   */
  @Input()
  public foo: FooEnum;

  @Input()
  public sample: string;

  /**
   * This is the description for baz input.
   * @example
   * ```
   * <app-foo [baz]="true"></app-foo>
   * ```
   */
  @Input()
  public baz: boolean = false;

  /**
   * This is the description for bar input. You must provide [[FooEnum]] values.
   * @defaultvalue FooEnum.Foo
   */
  @Input()
  public set bar(value: string) {
    this._bar = value;
  }

  public get bar(): string {
    return this._bar || 'bar';
  }

  /**
   * Use the latest and greatest features!
   * @deprecated This is no longer needed; all new features are available now.
   */
  @Input()
  public experimental: boolean = false;

  /**
   * This is the description for the click event.
   * @example
   * ```
   * <app-foo (click)="onClick($event)"></app-foo>
   * ```
   */
  @Output()
  public click = new EventEmitter<boolean>();

  /**
   * @hidden
   */
  @Input()
  public internalConfig: any;

  private _bar: string;

  public ngOnInit(): void { }
}
