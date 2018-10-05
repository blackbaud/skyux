import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';

import {
  SkyAvatarAdapterService
} from './avatar-adapter.service';
import {
  SkyAvatarSrc
} from './avatar-src';

@Component({
  selector: 'sky-avatar-inner',
  templateUrl: './avatar.inner.component.html',
  styleUrls: ['./avatar.inner.component.scss'],
  providers: [SkyAvatarAdapterService]
})
export class SkyAvatarInnerComponent implements AfterViewInit, OnDestroy {
  public get src(): SkyAvatarSrc {
    return this._src;
  }

  @Input()
  public set src(value: SkyAvatarSrc) {
    this._src = value;
    this.updateImage();
  }

  public get name(): string {
    return this._name;
  }

  @Input()
  public set name(value: string) {
    this._name = value;
  }

  private viewInitialized: boolean;

  private _src: SkyAvatarSrc;

  private _name: string;

  constructor(
    private elementRef: ElementRef,
    private adapter: SkyAvatarAdapterService
  ) { }

  public get initials(): string {
    let initials: string;

    if (this.name) {
      let nameSplit = this.name.split(' ');
      initials = getInitial(nameSplit[0]);

      if (nameSplit.length > 1) {
        initials += getInitial(nameSplit[nameSplit.length - 1]);
      }
    }

    return initials;
  }

  public get colorIndex(): number {
    let name = this.name;
    let colorIndex: number;

    if (name) {
        // Generate a unique-ish color based on the record name.  This is deterministic
        // so that a given name will always generate the same color.
        let seed = name.charCodeAt(0) + name.charCodeAt(name.length - 1) + name.length;
        colorIndex = Math.abs(seed % 6);
    } else {
        colorIndex = 0;
    }

    return colorIndex;
  }

  public ngAfterViewInit() {
    this.viewInitialized = true;
    this.updateImage();
  }

  public ngOnDestroy() {
    this.adapter.destroy();
  }

  private updateImage() {
    if (this.viewInitialized) {
      this.adapter.updateImage(this.elementRef, this.src);
    }
  }
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}
