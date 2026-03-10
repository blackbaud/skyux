import { Injectable } from '@angular/core';

@Injectable()
export class ModalTestContext {
  public bannerImageSrc?: string;
  public headingHidden?: boolean;
  public headingText: string | undefined;
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
}
