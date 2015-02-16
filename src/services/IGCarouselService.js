/**
 * Service that will give the image url corresponding to a category identified by his ID
 */
module.exports = [function () {

    var IGCarouselService = function() {};

    /**
     * Define the style of the category item if it's selected by setting the associated background define in category.color
     * @param category, the category to style
     * @returns object containing style property
     */
    IGCarouselService.getMinDiff = function (newIndex, oldIndex, arrayLength) {

        var leftCursor = oldIndex,
            rightCursor = oldIndex,
            diff = 0;

        for (diff; leftCursor !== newIndex && rightCursor !== newIndex; diff++) {
            leftCursor = ((leftCursor - 1) < 0) ? arrayLength - 1 : leftCursor - 1;
            rightCursor = ((rightCursor + 1) >= arrayLength) ? 0 : rightCursor + 1;
        }

        if(leftCursor === newIndex) {
            diff = diff * -1;
        }

        return diff;
    };

    return IGCarouselService;
}];