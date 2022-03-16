import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'sky-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyVideoComponent {
  @Input()
  public set videoSource(value: string) {
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(value);
    this.changeDetector.markForCheck();
  }

  public src: SafeResourceUrl;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}
}
