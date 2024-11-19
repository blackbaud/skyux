import {
  Component,
  EventEmitter,
  Input,
  Output,
  input,
  output,
} from '@angular/core';

/**
 * @docsSection banana
 */
@Component({
  imports: [],
  selector: 'lib-foo',
  standalone: true,
  template: ``,
})
export class FooComponent {
  public foo = input<string | undefined>(undefined);

  @Input()
  public bar: string | undefined;

  public onClick = output<void>();

  @Output()
  public onTouch = new EventEmitter<void>();
}
