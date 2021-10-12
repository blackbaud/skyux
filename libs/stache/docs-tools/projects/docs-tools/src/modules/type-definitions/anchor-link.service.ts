import {
  Injectable
} from '@angular/core';

import {
  SkyDocsAnchorLinkConfig
} from './anchor-link-service-config';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

/**
 * Finds any type name that is NOT surrounded by alpha-numeric (and '>', '<', '.') characters.
 * (This is to avoid matching types that share similar words, such as `Foo` and `FooUser`.)
 * Notes:
 *  - If the type name is surrounded by angle brackets, then it has already been processed as a link.
 *  - If the type name starts with a period '.', then it is a sub property of an enumeration, etc. and should not be processed as a link.
 *  - If the type name ends with a period followed immediately by any word character, then it is a method or property (Foo.bar).
 *    Only the type name should be processed as a link.
 */
function createRegex(keyword: string): RegExp {
  return new RegExp(`(^|[^a-zA-Z0-9>.[/])(${keyword})(\\.\\w+)?(?=[^a-zA-Z0-9<]+|$)`, 'g');
}

@Injectable({
  providedIn: 'any'
})
export class SkyDocsAnchorLinkService {

  private anchorIds: {[_: string]: string};

  constructor(
    typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) {
    this.anchorIds = typeDefinitionsProvider.anchorIds;
  }

  /**
   * Formats known type names with `<code>` tags and wraps them with anchor tags, linking to the appropriate type.
   * If the content is already contained within a `<code>` tag, set `codeFormat = false` to prevent extra `<code>` tags from being added.
   */
  public applyTypeAnchorLinks(content: string, config?: SkyDocsAnchorLinkConfig): string {
    if (!this.anchorIds || !content) {
      return content;
    }

    // Set default for code formatting.
    if (!config) {
      config = {
        applyCodeFormatting: true
      };
    }

    content = this.removeDoubleSquareBrackets(content);

    Object.keys(this.anchorIds).forEach((typeName) => {
      content = this.removeBackticks(typeName, content);

      let matches: RegExpExecArray;
      let counter = 0;
      const max = 100;

      const regex = createRegex(typeName);

      do {
        matches = regex.exec(content);
        if (matches) {
          const anchorId = this.anchorIds[typeName];
          const anchorHtml = '<a class="sky-docs-anchor-link" href="#' + anchorId + '">' + typeName + '</a>';

          // Group 3 of the regex pattern captures type properties like Foo.bar.
          // If these are found, they do not need hyperlinked, but add them to the encapsulating code tag.
          const typeProperty = (matches[3] ? matches[3] : '');

          let replacement;
          if (config.applyCodeFormatting) {
            replacement = '<code>' + anchorHtml + typeProperty + '</code>';
          } else {
            replacement = anchorHtml + typeProperty;
          }

          // Regex Positive lookbehinds aren't supported in IE11 and Safari, so we have to check if the match has a starting extra character
          // (usually whitespace " Foo"), and then modify the starting/ending indexes to account for the extra character.
          const isMatchExact = matches[0].substr(0, typeName.length) === typeName;
          const startIndex = isMatchExact ? matches.index : matches.index + 1;
          const endIndex = isMatchExact ? matches[0].length : matches[0].length - 1;
          let contentWithCodeTags = content.substr(0, startIndex) + replacement + content.substr(startIndex + endIndex);

          content = contentWithCodeTags;
          counter++;
        }
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

  /**
   * Removes backtick characters around known types to prevent
   * the markdown pipe from wrapping them with code elements.
   */
  private removeBackticks(typeName: string, content: string): string {
    const regexp = new RegExp(`\`(${typeName})\``, 'g');
    return content.replace(regexp, typeName);
  }

}
