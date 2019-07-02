let syntax        = 'scss',
    gulpVersion   = '3';

let gulp            = require('gulp'),
    gutil           = require('gulp-util' ),
    sass            = require('gulp-sass'),
    browserSync     = require('browser-sync'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    cleancss        = require('gulp-clean-css'),
    rename          = require('gulp-rename'),
    autoprefixer    = require('gulp-autoprefixer'),
    notify          = require('gulp-notify'),
    imagemin 	    = require("gulp-imagemin"),
    imageRecompress = require('imagemin-jpeg-recompress'),
    pngquant        = require('imagemin-pngquant'),
    run             = require("run-sequence"),
    del             = require("del"),
    svgSprite       = require('gulp-svg-sprite'),
    svgmin          = require('gulp-svgmin'),
    cheerio         = require('gulp-cheerio'),
    replace         = require('gulp-replace');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
        'app/libs/jquery/jquery.min.js',
        'app/libs/owlcarousel/owl.carousel.min.js',
		'app/js/common.js'
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('images', function () {
    return gulp.src(['app/img/**/*.{png,jpg}', '!app/img/favicon/apple-touch-icon-180x180.png'])
        .pipe(imagemin([
            imagemin.jpegtran({progressive: true}),
            imageRecompress({
                loops: 5,
                min: 65,
                max: 70,
                quality: 'medium'
            }),
            imagemin.optipng({optimizationLevel: 3}),
            pngquant({quality: '65-70', speed: 5})
        ]))
        .pipe(gulp.dest('build/img'));
});

gulp.task('svg', function () {
    return gulp.src('app/img/svg/**/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest('app/img'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('copy', function () {
    return gulp.src([
        'app/js/**',
        'app/css/**',
        'app/*.html',
        'app/fonts/**',
        'app/img/favicon/**',
        'app/img/symbol/**',
        'app/.htaccess'
    ], {
        base: 'app'
    })
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return del('build');
});

gulp.task('build', function (fn) {
    run(
        'styles',
        'scripts',
        'clean',
        'images',
        'svg',
        'copy',
        fn
    );
});

if (Number(gulpVersion) === 3) {
    gulp.task('watch', ['styles', 'scripts', 'svg', 'browser-sync'], function() {
        gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
        gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
        gulp.watch('app/img/svg/**/*.svg', ['svg']);
        gulp.watch('app/*.html', ['code'])
    });
    gulp.task('default', ['watch']);
}

if (Number(gulpVersion) === 4) {
    gulp.task('watch', function() {
        gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
        gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
        gulp.watch('app/*.html', gulp.parallel('code'))
    });
    gulp.task('default', gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));
}