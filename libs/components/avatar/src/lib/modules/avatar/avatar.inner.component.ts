import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyThemeModule } from '@skyux/theme';

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
  imports: [NgClass, SkyI18nModule, SkyThemeModule],
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

    if (value) {
      // Generate a unique-ish color based on the record name.  This is deterministic
      // so that a given name will always generate the same color.
      const seed =
        value.charCodeAt(0) + value.charCodeAt(value.length - 1) + value.length;
      this.#colorIndex = Math.abs(seed % 7);
    } else {
      this.#colorIndex = 0;
    }
  }

  @Input()
  public size: SkyAvatarSize | undefined = 'large';

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
    return this.#colorIndex;
  }

  #colorIndex = 0;

  public ngAfterViewInit(): void {
    this.#viewInitialized = true;
    this.#updateImage();
  }

  public ngOnDestroy(): void {
    this.#adapter.destroy();
  }

  #updateImage(): void {
    if (this.#viewInitialized && this.src) {
      this.#adapter.updateImage(this.#elementRef, this.src);
    }
  }
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}
