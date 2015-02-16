describe('Test ig-carousel directive', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
        elm = angular.element(
            '<div>' +
                '<ul ig-carousel animation-duration="800" auto-slide="true" rtl="true" slide-duration="5" item-displayed="5" >' +
                    '<li>' +
                        'First item' +
                    '</li>' +
                    '<li>' +
                        'Second item' +
                    '</li>' +
                    '<li>' +
                        'Third item' +
                    '</li>' +
                    '<li>' +
                        'Fourth item' +
                    '</li>' +
                    '<li>' +
                        'Fifth item' +
                    '</li>' +
                    '<li>' +
                        'Sixth item' +
                    '</li>' +
                    '<li>' +
                        'Seventh item' +
                    '</li>' +
                '</ul>' +
            '</div>');

        scope = $rootScope;
        $compile(elm)(scope);
        scope.$digest();
    }));

    it('should find directive', function() {
        var ul = elm.find('ul');
        expect(ul.length).toBe(1);
        expect(ul.attr('ig-carousel')).not.toBeNull();
    });

    it('should find 7 <li>', function() {
        var arrayChild = elm.find('li');
        expect(arrayChild.length).toBe(7);
    });

    it('first li is displayed', function() {
        var arrayChild = elm.find('li');
        expect($(arrayChild[0]).html()).toBe("First item");
    });
});