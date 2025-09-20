import { Injectable } from '@angular/core';

@Injectable()
export class ModalTestContext {
  public headingText: string | undefined;
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
}
