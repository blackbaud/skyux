import { Component } from '@angular/core';
import { SkyTextExpandModule } from '@skyux/layout';

@Component({
  imports: [SkyTextExpandModule],
  selector: 'app-text-expand',
  templateUrl: './text-expand.component.html',
})
export default class TextExpandComponent {
  protected shortText =
    'This text is short enough that it will not be truncated.';

  protected longText =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.';

  protected veryLongText =
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.';

  protected newlinesText =
    'Line one of the text.\nLine two of the text.\nLine three of the text.\nLine four of the text.';
}
