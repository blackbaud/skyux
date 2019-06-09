import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { FooEnum } from './foo-enum';

/**
 * This is the description for FooComponent.
 */
@Component({
  selector: 'app-foo',
  template: ''
})
export class FooComponent implements OnInit {

  /**
   * This is the description for foo input.
   */
  @Input()
  public foo: FooEnum;

  /**
   * This is the description for bar input.
   */
  @Input()
  public set bar(value: string) {
    this._bar = value;
  }
  public get bar(): string {
    return this._bar || 'bar';
  }

  @Output()
  public click = new EventEmitter<boolean>();

  private _bar: string;

  public ngOnInit(): void {}
}
