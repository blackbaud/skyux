import {
  ListItemModel
} from './item.model';

describe('list items', () => {
  describe('list item model', () => {
    it('should throw an error when initializing without an id', () => {
      expect(function () {
        return new ListItemModel(undefined, 'something');
      }).toThrow(new Error('All list item models require an ID'));
    });

    it('should not set data when data is undefined', () => {
      let item = new ListItemModel('id');
      expect(item.data).toBeUndefined();
    });
  });
});
