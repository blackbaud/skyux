import {
  Component,
  EventEmitter,
  Input,
  Output,
  input,
  output,
} from '@angular/core';

@Component({
  imports: [],
  selector: 'lib-foo',
  standalone: true,
  template: ``,
})
export class FooComponent {
  /**
   * This describes the foo input.
   */
  public foo = input<string | undefined>(undefined);

  /**
   * This describes the fooRequired input.
   */
  public fooRequired = input.required<string>();

  /**
   * This describes the bar input.
   * @default 'baz'
   * @required
   */
  @Input()
  public bar: string | undefined;

  /**
   * This describes the onClick output.
   */
  public onClick = output<void>();

  /**
   * This describes the onTouch output.
   */
  @Output()
  public onTouch = new EventEmitter<void>();
}
