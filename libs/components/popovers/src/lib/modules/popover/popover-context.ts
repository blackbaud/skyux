import { TemplateRef } from '@angular/core';

/**
 * @internal
 */
export class SkyPopoverContext {
  public readonly contentTemplateRef: TemplateRef<unknown>;

  constructor(args: { contentTemplateRef: TemplateRef<unknown> }) {
    this.contentTemplateRef = args.contentTemplateRef;
  }
}
