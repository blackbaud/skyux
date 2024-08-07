import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyFileAttachmentAriaDescribedby',
  pure: true,
  standalone: true,
})
export class SkyFileAttachmentAriaDescribedbyPipe implements PipeTransform {
  public transform(): string | null {
    return null;
  }
}
