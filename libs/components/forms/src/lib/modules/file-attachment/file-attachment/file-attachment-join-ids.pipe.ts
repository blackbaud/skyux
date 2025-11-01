import { Pipe, PipeTransform } from '@angular/core';

/**
 * Joins an array of IDs with a single space.
 * @internal
 */
@Pipe({
  name: 'skyFileAttachmentJoinIds',
})
export class SkyFileAttachmentJoinIdsPipe implements PipeTransform {
  public transform(...ids: (string | null | undefined)[]): string | null {
    // Remove undefined values and join with a " ".
    return ids && ids.filter((id) => id).join(' ');
  }
}
