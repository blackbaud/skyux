import { ReplaySubject } from 'rxjs';

import { SkyAppViewportService } from './viewport.service';

describe('Viewport service', () => {
  it('should return an observable when the content is visible', () => {
    const service = new SkyAppViewportService();
    expect(service.visible instanceof ReplaySubject).toEqual(true);
  });
});
