import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-code-example',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCodeExampleComponent {

  @Input()
  public sourceCodeLocation: string;

  @Input()
  public heading: string;

}
