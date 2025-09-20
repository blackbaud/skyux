import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
} from '@angular/core';

import { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-link',
  templateUrl: './custom-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
      }

      sky-ag-grid-wrapper {
        display: block;
        width: 100%;
        overflow: auto;
      }
    `,
  ],
})
export class CustomLinkComponent implements ICellRendererComp {
  public link: string;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  public getGui(): HTMLElement {
    return this.elementRef.nativeElement as HTMLElement;
  }

  public agInit(params: ICellRendererParams): void {
    this.checkLink(params.value);
  }

  public refresh(params: ICellRendererParams): boolean {
    this.checkLink(params.value);
    return false;
  }

  private checkLink(value: unknown): void {
    if (!value) {
      if (this.link) {
        this.link = '';
        this.changeDetectorRef.markForCheck();
      }
    } else {
      let newValue = '';
      try {
        const url = new URL(String(value));
        newValue = url.toString();
      } catch (e) {
        // invalid url.
      }
      if (newValue !== this.link) {
        this.link = newValue;
        this.changeDetectorRef.markForCheck();
      }
    }
  }
}
