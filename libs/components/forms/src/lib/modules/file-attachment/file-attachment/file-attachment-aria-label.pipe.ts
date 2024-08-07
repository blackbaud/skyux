import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyFileAttachmentAriaLabel',
  pure: true,
  standalone: true,
})
export class SkyFileAttachmentAriaLabelPipe implements PipeTransform {
  public transform(): string | null {
    return null;
  }
}
