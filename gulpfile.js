var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename');


var destDir = "dist/";
var destFileName = "ig-carousel.js";

gulp.task('build-dev', function () {
    return gulp.src('src/ig-carousel.js')
        .pipe(browserify({
            debug: true
        }))
        .pipe(rename('ig-carousel.js'))
        .pipe(gulp.dest("./dist/"));
});

gulp.task('watch', function () {
    return gulp.watch(['src/**/*'], ['build-dev'], function(evt) {
        console.log('file has changed');
    });
});

gulp.task('default', ['watch']);
