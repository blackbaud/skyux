import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'app-colorpicker-docs',
  templateUrl: './colorpicker-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorpickerDocsComponent {

  public model: any = {
    favoriteColor: 'rgb(0, 0, 225)'
  };

}
