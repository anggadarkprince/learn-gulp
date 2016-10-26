// Gulp.js configuration

// include gulp and plugins
var gulp = require('gulp');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var del = require('del');

// file locations
var source = 'src/'
var dest = 'build/';
var images = {
    in: source + 'images/*.*',
    out: dest + 'images/'
}

// clean the build folder
gulp.task('clean', function(){
    del([
        dest + '*'
    ]);
})

// manage images
gulp.task('images', function(){
    return gulp.src(images.in)
        .pipe(newer(images.out))
        .pipe(imagemin())
        .pipe(gulp.dest(images.out))
});

// default task
gulp.task('default', function(){

});