'use strict';

const gulp = require('gulp')
const {
    src, dest, parallel, series, watch
} = require('gulp')
const gsass = require('gulp-sass')
gsass.compiler = require('node-sass')
const gpug = require('gulp-pug')
var browserSync = require('browser-sync').create();


function sass() {
    return src('index.sass')
        .pipe(gsass().on('error', gsass.logError))
        .pipe(dest('./dist'));
}

gulp.task('sass:watch', function () {
    gulp.watch('index.sass', sass);
});

function pug() {
    return src('index.pug')
        .pipe(gpug({}))
        .pipe(dest('./dist'))
}

gulp.task('pug:watch', function () {
    gulp.watch('index.pug', pug);
});


gulp.task('serve', function () {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch("index.sass", series('sasspipe'));
    gulp.watch("index.pug", series('pug'));
    gulp.watch("dist/*.html").on('change', browserSync.reload);
    gulp.watch("dist/*.css").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sasspipe', function () {
    return gulp.src("index.sass")
        .pipe(gsass().on('error', gsass.logError))
        .pipe(gulp.dest("dist/"))
        .pipe(browserSync.stream({reload:true}));
});


exports.sass = sass;
exports.pug = pug;
exports.default = parallel(sass, pug);
exports.watch = parallel('pug:watch', 'sass:watch');