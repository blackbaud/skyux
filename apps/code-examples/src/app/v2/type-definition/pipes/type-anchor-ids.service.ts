import { Injectable } from '@angular/core';

/**
 * Registers known type symbols with their corresponding anchor IDs.
 * @internal
 */
@Injectable()
export class SkyTypeAnchorIdsService {
  #anchorIds = new Map<string, string>();

  public updateAnchorIds(anchorIds: { [token: string]: string }): void {
    this.#anchorIds = new Map(Object.entries(anchorIds));

    // Sort items by character length.
    // this.#names = typeDefinitions
    //   .map((d) => d.name)
    //   // TODO: Do I need to do this?
    //   .sort((a, b) => b.length - a.length);
  }

  // public includesName(typeName: string): boolean {
  //   return this.#names.includes(typeName);
  // }

  public getAnchorId(typeName: string): string | undefined {
    return this.#anchorIds.get(typeName);
  }
}
