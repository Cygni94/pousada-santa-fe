// Para rodar o browsersync e o sass, utilize npm run gulp server
// Para gerar a versão dist, utilize npm run gulp

// INSTALE O GULP-SPRITESMITH: https://github.com/twolfson/gulp.spritesmith

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev'),
    imagemin = require('gulp-image'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    uncss = require('postcss-uncss'),
    del = require('del'),
    autoprefixer = require('autoprefixer');


// build dist
gulp.task('default', ['copy'], function () {
    gulp.start('build-img', 'usemin');
});

gulp.task('copy', ['clean'], function () {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return del('dist');
});

gulp.task('build-img', function () {
    return gulp.src('dist/assets/img/**/*')
        .pipe(imagemin({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            guetzli: false,
            gifsicle: true,
            svgo: true,
            concurrent: 100
        }))
        .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('usemin', function () {
    return gulp.src('./*.html')
        .pipe(usemin({
            html: [htmlmin({
                collapseWhitespace: true
            })],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [ cleanCSS(), 'concat' ]
        }))
        .pipe(gulp.dest('dist/'));
});


// Static Server + watching scss/html files
gulp.task('server', ['sass'], function () {

    browserSync.init({
        server: "./src"
    });

    gulp.watch("src/assets/sass/**/*.scss", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src("src/assets/sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("src/assets/css"))
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest("src/assets/css"))
        .pipe(browserSync.stream());

});