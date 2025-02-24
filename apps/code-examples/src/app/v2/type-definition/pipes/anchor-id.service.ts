import { Injectable } from '@angular/core';

@Injectable()
export class SkyAnchorIdService {
  #anchorIds = new Map<string, string>();
  // #names: string[] = [];

  public setAnchorIds(anchorIds: { [typeName: string]: string }): void {
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
