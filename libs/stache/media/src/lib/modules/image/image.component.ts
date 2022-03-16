import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sky-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyImageComponent {
  @Input()
  public caption: string;

  @Input()
  public captionType = 'default';

  @Input()
  public imageAlt = 'image';

  @Input()
  public imageSource: string;

  @Input()
  public showBorder = false;

  @Input()
  public set showCaptionPrefix(value: boolean) {
    this._showCaptionPrefix = value;
  }

  public get showCaptionPrefix(): boolean {
    if (this._showCaptionPrefix === undefined) {
      return true;
    }

    return this._showCaptionPrefix;
  }

  private _showCaptionPrefix: boolean = true;
}
