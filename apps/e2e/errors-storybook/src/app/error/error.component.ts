import { Component } from '@angular/core';
import { SkyErrorType } from '@skyux/errors';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: false,
})
export class ErrorComponent {
  public customAction = false;
  public customImage = false;
  public customTitleAndDescription = false;
  public errorType: SkyErrorType = 'broken';
  public pageError = true;
  public replaceDefaultTitleAndDescription = false;
  public showImage = true;
}
