import {
  Injectable
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

/**
 * Finds any type name that is NOT surrounded by alpha-numeric (and '>', '<', '.') characters.
 * (This is to avoid matching types that share similar words, such as `Foo` and `FooUser`.)
 * Notes:
 *  - If the type name is surrounded by angle brackets, then it has already been processed as a link.
 *  - If the type name starts with a period '.', then it is a sub property of an enumeration, etc. and should not be processed as a link.
 */
function createRegex(keyword: string): RegExp {
  return new RegExp(`(^|[^a-zA-Z0-9>.[/]+)(${keyword})([^a-zA-Z0-9<]+|$)`, 'g');
}

@Injectable()
export class SkyDocsAnchorLinkService {

  private anchorIds: {[_: string]: string};

  constructor(
    typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) {
    this.anchorIds = typeDefinitionsProvider.anchorIds;
  }

  public applyTypeAnchorLinks(content: string): string {
    if (!this.anchorIds || !content) {
      return content;
    }

    content = this.removeDoubleSquareBrackets(content);

    Object.keys(this.anchorIds).forEach((typeName) => {
      const anchorId = this.anchorIds[typeName];
      const anchorHtml = `<a class="sky-docs-anchor-link" href="#${anchorId}">${typeName}</a>`;
      const regex = createRegex(typeName);

      let matches: RegExpExecArray;
      let counter = 0;
      const max = 100;

      do {
        matches = regex.exec(content);
        if (matches) {
          const replacement = matches[0].replace(typeName, anchorHtml);
          content = content.replace(
            matches[0],
            replacement
          );
          regex.lastIndex = 0;
        }
        counter++;
      } while (matches !== null && counter < max);
    });

    return content;
  }

  /**
   * For backwards compatibility, we need to remove any double brackets wrapped around types.
   * e.g., `[[SampleType]]`
   */
  private removeDoubleSquareBrackets(content: string): string {
    const match = content.match(/\[\[.*\]\]/);
    if (match) {
      const typeName = match[0].replace(/\[\[/g, '').replace(/\]\]/g, '');
      content = content.replace(match[0], typeName);
    }
    return content;
  }

}
