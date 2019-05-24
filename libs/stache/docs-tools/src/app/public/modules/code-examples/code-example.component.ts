import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-code-example',
  template: ''
})
export class SkyDocsCodeExampleComponent {

  @Input()
  public sourceCodeLocation: string;

  @Input()
  public title: string;

}
