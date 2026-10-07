import {
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
} from '@angular/core';

@Component({
  selector: 'app-lipsum',
  templateUrl: './lipsum.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LipsumComponent {
  public readonly paragraphs = input<number, unknown>(5, {
    transform: numberAttribute,
  });
}
