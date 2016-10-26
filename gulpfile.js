// Gulp.js configuration

// include gulp and plugins
var gulp = require('gulp');
var util = require('gulp-util');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var del = require('del');
pkg = require('./package.json');

// file locations
// add constant variable on linux via terminal `export NODE_ENV=production` check echo $NODE_ENV
var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production')
var source = 'src/'
var dest = 'build/';
var images = {
    in: source + 'images/*.*',
    out: dest + 'images/'
}

// show build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');

// clean the build folder
gulp.task('clean', function () {
    del([
        dest + '*'
    ]);
})

// manage images
gulp.task('images', function () {
    return gulp.src(images.in)
        .pipe(newer(images.out))
        .pipe(imagemin())
        .pipe(gulp.dest(images.out))
});

// default task, task run in almost same time not by order of array
gulp.task('default', ['images'], function () {
    util.log('Run default gulp task');

    // image changes
    gulp.watch(images.in, ['images']);
});