import {
  Pipe,
  PipeTransform
} from '@angular/core';

/**
 * This is the description for the FooPipe.
 */
@Pipe({
  name: 'foo'
})
export class FooPipe implements PipeTransform {

  /**
   * Transforms the content.
   */
  public transform(content: string): string {
    return content;
  }

}
