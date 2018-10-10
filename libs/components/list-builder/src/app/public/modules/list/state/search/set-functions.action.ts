export class ListSearchSetFunctionsAction {
  constructor(public functions: Array<(data: any, searchText: string) => boolean> = []) {}
}
