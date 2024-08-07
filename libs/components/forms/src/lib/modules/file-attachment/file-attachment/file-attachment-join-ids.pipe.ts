import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyFileAttachmentJoinIds',
  standalone: true,
})
export class SkyFileAttachmentJoinIdsPipe implements PipeTransform {
  public transform(...ids: (string | null | undefined)[]): string | null {
    return ids ? ids.filter((id) => id).join(' ') : null;
  }
}
