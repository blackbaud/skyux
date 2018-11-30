import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-error-description',
  template: '<ng-content></ng-content>'
})
export class SkyErrorDescriptionComponent {
  @Input()
  public replaceDefaultDescription: boolean = false;
}
