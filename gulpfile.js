// Gulp.js configuration
"use strict";

// include gulp and plugins
var gulp = require('gulp');
var util = require('gulp-util');
var newer = require('gulp-newer');
var preprocess = require('gulp-preprocess');
var htmlclean = require('gulp-htmlclean');
var sass = require('gulp-sass');
var size = require('gulp-size');
var imagemin = require('gulp-imagemin');
var imacss = require('gulp-imacss');
var pleeease = require('gulp-pleeease');
var jshint = require('gulp-jshint');
var del = require('del');
var pkg = require('./package.json');

// file locations
// add constant variable on linux via terminal `export NODE_ENV=production` check echo $NODE_ENV
var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production')
var source = 'src/'
var dest = 'build/';
var html = {
    in: source + '*.html',
    watch: [source + '*.html', source + 'template/**/*'],
    out: dest,
    context: {
        devBuild: devBuild,
        author: pkg.author,
        version: pkg.version
    }
}
var images = {
    in: source + 'images/*.*',
    out: dest + 'images/'
}
var imguri = {
    in: source + 'images/inline/*',
    out: source + 'scss/images/',
    filename: '_datauri.scss',
    namespace: 'img'
}
var css = {
    in: source + 'scss/main.scss',
    watch: [source + 'scss/**/*', '!' + imguri.out + imguri.file], // except _datauri.scss because it generated and avoid infinite loop from scss watcher
    out: dest + 'css/',
    sassOpts: {
        outputStyle: 'nested',
        precision: 3,
        errLogToConsole: true
    },
    pleeeaseOpts: {
        autoprefixer: {browsers: ['last 2 versions', '> 2%']},
        rem: ['16px'], // 1 rem
        pseudoElements: true,
        mqpacker: true,
        minifier: !devBuild
    }
}
var fonts = {
    in: source + 'fonts/*.*',
    out: css.out + 'fonts'
}
var js = {
    in: source + 'js/*.*',
    out: dest + 'js/',
    filename: 'main.js'
}

// show build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');

// clean the build folder
gulp.task('clean', function () {
    del([
        dest + '*'
    ]);
});

// build HTML files
gulp.task('html', function () {
    /*return gulp.src(html.in)
     .pipe(preprocess({context: html.context}))
     .pipe(gulp.dest(html.out))*/
    var page = gulp.src(html.in).pipe(preprocess({context: html.context}));
    if (!devBuild) {
        page = page
            .pipe(size({title: 'HTML in'}))
            .pipe(htmlclean())
            .pipe(size({title: 'HTML out'}));
    }
    return page.pipe(gulp.dest(html.out));
});

// manage images
gulp.task('images', function () {
    return gulp.src(images.in)
        .pipe(newer(images.out))
        .pipe(imagemin())
        .pipe(gulp.dest(images.out));
});

// image uri
gulp.task('imguri', function () {
    return gulp.src(imguri.in)
        .pipe(imagemin())
        .pipe(imacss(imguri.filename, imguri.namespace))
        .pipe(gulp.dest(imguri.out));
});

// copy fonts
gulp.task('fonts', function () {
    return gulp.src(fonts.in)
        .pipe(newer(fonts.out))
        .pipe(gulp.dest(fonts.out));
});

// compile sass
gulp.task('sass', ['imguri'], function () {
    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
        .pipe(size({title: 'CSS in'}))
        .pipe(pleeease(css.pleeeaseOpts))
        .pipe(size({title: 'CSS out'}))
        .pipe(gulp.dest(css.out));
});

gulp.task('js', function(){
    return gulp.src(js.in)
        .pipe(newer(js.out))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        .pipe(gulp.dest(js.out));
});


// default task, task run in almost same time not by order of array
gulp.task('default', ['html', 'images', 'fonts', 'sass', 'js'], function () {
    util.log('Run default gulp task');

    // html changes
    gulp.watch(html.watch, ['html']);

    // image changes
    gulp.watch(images.in, ['images']);

    // font changes
    gulp.watch(fonts.in, ['fonts']);

    // sass changes
    gulp.watch([css.watch, imguri.in], ['sass']);

    // javascript changes
    gulp.watch(js.in, ['js']);
});