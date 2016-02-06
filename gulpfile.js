/**
 * Created by jimi on 02/02/2016.
 */

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    sassDir = 'public/scss/main.scss',
    cssOutputDir = 'public/css/';

gulp.task('css', function () {
    return gulp.src(sassDir)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssOutputDir));
});

gulp.task('watch', function () {
    gulp.watch(sassDir, ['css']);
});





