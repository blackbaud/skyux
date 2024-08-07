import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyFileAttachmentAriaLabelledby',
  pure: true,
  standalone: true,
})
export class SkyFileAttachmentAriaLabelledbyPipe implements PipeTransform {
  public transform(...ids: (string | null | undefined)[]): string | null {
    return ids ? ids.filter((id) => id).join(' ') : null;
  }
}
