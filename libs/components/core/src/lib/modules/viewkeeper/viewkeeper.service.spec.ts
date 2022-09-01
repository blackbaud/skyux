import { SkyViewkeeperService } from './viewkeeper.service';

describe('Viewkeeper service', () => {
  it('should create and destroy viewkeeper instances', () => {
    const testEl = document.createElement('div');
    const testBoundaryEl = document.createElement('div');

    const svc = new SkyViewkeeperService();

    const viewkeeper = svc.create({
      boundaryEl: testBoundaryEl,
      el: testEl,
    });

    const destroySpy = spyOn(viewkeeper, 'destroy');
    svc.destroy(viewkeeper);
    expect(destroySpy).toHaveBeenCalled();
  });
});
