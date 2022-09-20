import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import { SkyAvatarAdapterService } from './avatar-adapter.service';
import { SkyAvatarSize } from './avatar-size';
import { SkyAvatarSrc } from './avatar-src';

/**
 * @internal
 */
@Component({
  selector: 'sky-avatar-inner',
  templateUrl: './avatar.inner.component.html',
  styleUrls: ['./avatar.inner.component.scss'],
  providers: [SkyAvatarAdapterService],
  encapsulation: ViewEncapsulation.None,
})
export class SkyAvatarInnerComponent implements AfterViewInit, OnDestroy {
  public get src(): SkyAvatarSrc | undefined {
    return this.#_src;
  }

  @Input()
  public set src(value: SkyAvatarSrc | undefined) {
    this.#_src = value;
    this.#updateImage();
  }

  public get name(): string | undefined {
    return this.#_name;
  }

  @Input()
  public set name(value: string | undefined) {
    this.#_name = value;
  }

  @Input()
  public size: SkyAvatarSize = 'large';

  #viewInitialized = false;

  #_src: SkyAvatarSrc | undefined;

  #_name: string | undefined;

  #elementRef: ElementRef;
  #adapter: SkyAvatarAdapterService;

  constructor(elementRef: ElementRef, adapter: SkyAvatarAdapterService) {
    this.#elementRef = elementRef;
    this.#adapter = adapter;
  }

  public get initials(): string | undefined {
    let initials: string | undefined;

    if (this.name) {
      const nameSplit = this.name.split(' ');
      initials = getInitial(nameSplit[0]);

      if (nameSplit.length > 1) {
        initials += getInitial(nameSplit[nameSplit.length - 1]);
      }
    }

    return initials;
  }

  public get colorIndex(): number {
    const name = this.name;
    let colorIndex: number;

    if (name) {
      // Generate a unique-ish color based on the record name.  This is deterministic
      // so that a given name will always generate the same color.
      const seed =
        name.charCodeAt(0) + name.charCodeAt(name.length - 1) + name.length;
      colorIndex = Math.abs(seed % 6);
    } else {
      colorIndex = 0;
    }

    return colorIndex;
  }

  public ngAfterViewInit() {
    this.#viewInitialized = true;
    this.#updateImage();
  }

  public ngOnDestroy() {
    this.#adapter.destroy();
  }

  #updateImage() {
    if (this.#viewInitialized && this.src) {
      this.#adapter.updateImage(this.#elementRef, this.src);
    }
  }
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}
