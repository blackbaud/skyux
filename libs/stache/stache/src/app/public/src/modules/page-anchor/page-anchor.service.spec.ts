import { StachePageAnchorService } from './page-anchor.service';

describe('StacheTableOfContentsService', () => {
  let tocService: StachePageAnchorService;
  let anchor: {
    path: 'Test Path'
    name: 'Test Name',
    fragment: 'Test Fragment'
  };

  beforeEach(() => {
    tocService = new StachePageAnchorService();
  });

  it('should add anchor to stream', () => {
    tocService.addPageAnchor(anchor);
    let subscription = tocService.anchorStream.subscribe(link =>
      expect(link.name).toBe(anchor.name)
    );
    subscription.unsubscribe();
  });
});
