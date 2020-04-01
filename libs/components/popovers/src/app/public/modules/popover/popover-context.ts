import {
  Injectable,
  TemplateRef
} from '@angular/core';

/**
 * @dynamic
 * @internal
 */
@Injectable()
export class SkyPopoverContext {

  public readonly contentTemplateRef: TemplateRef<any>;

  constructor(
    args: {
      contentTemplateRef: TemplateRef<any>
    }
  ) {
    this.contentTemplateRef = args.contentTemplateRef;
  }

}
