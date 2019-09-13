import {
  Injectable
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

@Injectable()
export class SkyDocsAnchorLinkService {

  private anchorIds: {[_: string]: string};

  constructor(
    private typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) {
    this.anchorIds = this.typeDefinitionsProvider.anchorIds;
  }

  /**
   * Replace all instances of '[[sometype]]' with the link to the element.
   */
  public buildAnchorLinks(content: string): string {
    const match = content.match(/\[\[.*\]\]/);

    if (match) {
      const typeName = match[0].replace('[[', '').replace(']]', '');
      const anchorId = this.anchorIds[typeName];

      if (anchorId) {
        const href = this.getHref(anchorId);
        const replacement = match[0].replace('[[', `<a href="${href}">`).replace(']]', '</a>');

        return content.replace(match[0], replacement);
      }
    }

    return content;
  }

  public wrapWithAnchorLink(content: string): string {
    const matchingTypes = Object.keys(this.anchorIds).filter((anchorId) => {
      return new RegExp(anchorId).test(content);
    });

    let html: string;

    if (matchingTypes.length) {

      // Sort by longest name.
      matchingTypes.sort((a, b) => b.length - a.length);

      const typeName = matchingTypes[0];
      const anchorId = this.anchorIds[typeName];
      const href = this.getHref(anchorId);
      const anchorHtml = `<a href="${href}">${typeName}</a>`;

      html = content.replace(typeName, anchorHtml);
    } else {
      html = content;
    }

    return html;
  }

  private getHref(anchorId: string): string {
    const url = window.location.href.split('#')[0];
    const href = `${url}#${anchorId}`;
    return href;
  }

}
