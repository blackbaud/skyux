import { TemplateRef } from '@angular/core';

/**
 * @dynamic
 * @internal
 */
export class SkyPopoverContext {
  public readonly contentTemplateRef: TemplateRef<unknown>;

  constructor(args: { contentTemplateRef: TemplateRef<unknown> }) {
    this.contentTemplateRef = args.contentTemplateRef;
  }
}
