import { Injectable } from '@angular/core';

@Injectable()
export class ModalTestContext {
  public bannerContent?: string;
  public bannerImageSrc?: string;
  public headingHidden?: boolean;
  public headingText?: string;
  public helpPopoverContent?: string;
  public modalContent?: string;
}
