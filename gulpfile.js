var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    karma = require('karma').server;

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

gulp.task('prod', function () {
    return gulp.src('src/ig-carousel.js')
        .pipe(browserify({
            debug: false
        }))
        .pipe(rename('ig-carousel.js'))
        .pipe(gulp.dest("./dist/"))
        .pipe(uglify())
        .pipe(rename('ig-carousel.min.js'))
        .pipe(gulp.dest("./dist/"));
});

gulp.task('watch', function () {
    return gulp.watch(['src/**/*'], ['build-dev'], function(evt) {
        console.log('file has changed');
    });
});

/**
 * Run test
 */
gulp.task('test', ['build-dev'], function (done) {

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('default', ['watch']);
