describe('Test ig-carousel service', function() {
    var service;
    var array = [ 1, 2, 3, 10, 56, "test"];

    beforeEach(inject(function($injector) {
        service = $injector.get('ig-service');
    }));

    it('should have function getMinDiff()', function() {
        expect(service.getMinDiff).toBeDefined();
    });

    it('should return 1', function() {
        var newIndex = 1,
            oldIndex = 0
            result = 0;

        result = service.getMinDiff(newIndex, oldIndex, array.length);
        expect(result).toBe(1);
    });

    it('should return +3 and not -3', function() {
        var newIndex = 3,
            oldIndex = 0
            result = 0;

        result = service.getMinDiff(newIndex, oldIndex, array.length);
        expect(result).toBe(3);
    });

    it('should return -1 and not 6', function() {
        var newIndex = 6,
            oldIndex = 0
            result = 0;

        result = service.getMinDiff(newIndex, oldIndex, array.length);
        expect(result).toBe(-1);
    });
});