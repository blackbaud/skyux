import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-error-title',
  template: '<ng-content></ng-content>'
})
export class SkyErrorTitleComponent {
  @Input()
  public replaceDefaultTitle: boolean = false;
}
