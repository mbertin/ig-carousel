/**
 * Service that will give the image url corresponding to a category identified by his ID
 */
module.exports = [function () {

    var IGCarouselService = function() {};

    /**
     * Get the min diff in a array for going from an index to another in a array with a specified length
     * @param newIndex, the new index to go
     * @param oldIndex, the old index that indicate the start
     * @param arrayLength, the size of the given array
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

        if(leftCursor === newIndex && rightCursor !== newIndex) {
            diff = diff * -1;
        }

        return diff;
    };

    return IGCarouselService;
}];