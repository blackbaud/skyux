import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'stache-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class StacheVideoComponent implements OnInit {
  @Input()
  public videoSource: string;

  public src: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer) { }

  public ngOnInit() {
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoSource);
  }
}
