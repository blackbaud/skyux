import {
  SkyAppViewportService
} from './viewport.service';

import {
  ReplaySubject
} from 'rxjs/ReplaySubject';

describe('Viewport service', () => {
  it('should return an observable when the content is visible', () => {
    const service = new SkyAppViewportService();
    expect(service.visible instanceof ReplaySubject).toEqual(true);
  });
});
