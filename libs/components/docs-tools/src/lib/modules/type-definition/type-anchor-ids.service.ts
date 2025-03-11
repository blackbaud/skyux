import { Injectable } from '@angular/core';

/**
 * Registers known type symbols with their corresponding anchor IDs.
 * @internal
 */
@Injectable()
export class SkyDocsTypeDefinitionAnchorIdsService {
  #anchorIds = new Map<string, string>();

  public updateAnchorIds(anchorIds: Record<string, string>): void {
    this.#anchorIds = new Map(Object.entries(anchorIds));
  }

  public getAnchorId(typeName: string): string | undefined {
    return this.#anchorIds.get(typeName);
  }
}
