import {
  SkyAppTitleService
} from './title.service';

describe('Title service', () => {

  let titleSvc: SkyAppTitleService;
  let testTitle: string;

  beforeEach(() => {
    titleSvc = new SkyAppTitleService({
      getTitle: () => testTitle,
      setTitle: (newTitle: string) => testTitle = newTitle
    } as any);
  });

  afterEach(() => {
    testTitle = undefined;
  });

  it('should set the document title', () => {
    titleSvc.setTitle({
      titleParts: [
        'Part 1',
        'Part 2'
      ]
    });

    expect(testTitle).toBe('Part 1 - Part 2');
  });

  it('should ignore invalid arguments', () => {
    titleSvc.setTitle({
      titleParts: [
        'Part 3',
        'Part 4'
      ]
    });

    expect(testTitle).toBe('Part 3 - Part 4');

    titleSvc.setTitle(undefined);

    expect(testTitle).toBe('Part 3 - Part 4');

    titleSvc.setTitle({
      titleParts: undefined
    });

    expect(testTitle).toBe('Part 3 - Part 4');
  });

});
