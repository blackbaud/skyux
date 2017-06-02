import { StacheRouteMetadataService } from './index';

describe('StacheRouteMetadataService', () => {
  it('should have a routes property', () => {
    const routeMetadataService = new StacheRouteMetadataService();
    expect(routeMetadataService.routes).toBeDefined();
  });
});
