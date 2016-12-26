var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var minifycss = require('gulp-uglifycss');
var autoprefixer = require('gulp-autoprefixer');
var mmq = require('gulp-merge-media-queries');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var lineec = require('gulp-line-ending-corrector');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var streamqueue = require('streamqueue');
var filter = require('gulp-filter');
var browserSync = require('browser-sync').create();
var rimraf = require('gulp-rimraf');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var reload = browserSync.reload;


var paths = {
    assets: {
        scriptsSrc: './assets/js/*.js',
        scriptsDist: './build/js',
        stylesSrc: './assets/scss/style.scss',
        stylesDist: './build/css',
        imagesSrc: './assets/img/**/*.{png,jpg,gif,svg}',
        imagesDist: './build/img',
    },
    // Sass will check these folders for files when you use @import.
    sass: [
        'bower_components/bootstrap/scss',
        'bower_components/font-awesome/scss'
    ]
}

const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

gulp.task('browser-sync', function () {
    browserSync.init({
        server: "./build",
        open: true,
        injectChanges: true
    });
});

gulp.task('empty-build', function() {
  return gulp.src('./build', { read: false })
    .pipe(rimraf());
});


gulp.task('build-template-cache', ['empty-build'],  function () {
  gulp.src('./partials/**/*.html')
   .pipe(templateCache({root:'partials/', standalone:true, module:'DS.templates'}))
   .pipe(gulp.dest("./build/js"));
});

gulp.task('styles', ['empty-build'], function () {
    gulp.src(paths.assets.stylesSrc)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: paths.sass,
            errLogToConsole: true,
            outputStyle: 'compact',
            precision: 10
        }))
        .on('error', console.error.bind(console))
        .pipe(sourcemaps.write({
            includeContent: false
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(sourcemaps.write('./'))
        .pipe(lineec())
        .pipe(gulp.dest(paths.assets.stylesDist))

    .pipe(filter('**/*.css'))
        .pipe(mmq({
            log: true
        }))

    .pipe(browserSync.stream())

    .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss({
            maxLineLen: 10
        }))
        .pipe(lineec())
        .pipe(gulp.dest(paths.assets.stylesDist))

    .pipe(filter('**/*.css'))
        .pipe(browserSync.stream())
        .pipe(notify({
            message: 'TASK: "styles" Completed! 💯',
            onLast: true
        }))
});


gulp.task('AppJs', ['empty-build'], function () {
  gulp.src(paths.assets.scriptsSrc)
        .pipe(concat('app' + '.js'))
        .pipe(lineec())
        .pipe(gulp.dest(paths.assets.scriptsDist))
        .pipe(rename({
            basename: 'app',
            suffix: '.min'
        }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        //.pipe(lineec())
        .pipe(gulp.dest(paths.assets.scriptsDist))
        .pipe(notify({
            message: 'TASK: "AppJs" Completed! 💯',
            onLast: true
        }));
});

gulp.task('VendorJs', ['empty-build'], function () {
    return streamqueue({
                objectMode: true
            },
            gulp.src('bower_components/jquery/jquery.min.js'),
            gulp.src('bower_components/angular/angular.min.js'),
            gulp.src('bower_components/angular-route/angular-route.min.js'),
            gulp.src('bower_components/bootstrap/dist/bootstrap.min.js')
        )
        .pipe(concat('bundle' + '.js'))
        .pipe(lineec())
        .pipe(gulp.dest(paths.assets.scriptsDist))
        .pipe(rename({
            basename: 'bundle',
            suffix: '.min'
        }))
        .pipe(ngAnnotate())
        .pipe(uglify())
        //.pipe(lineec())
        .pipe(gulp.dest(paths.assets.scriptsDist))
        .pipe(notify({
            message: 'TASK: "VendorJs" Completed! 💯',
            onLast: true
        }));
});

gulp.task('images', ['empty-build'], function () {
    gulp.src(paths.assets.imagesSrc)
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 3, // 0-7 low-high
            interlaced: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest(paths.assets.imagesDist))
        .pipe(notify({
            message: 'TASK: "images" Completed! 💯',
            onLast: true
        }));
});

gulp.task('views', ['empty-build'], function() {
    // Get our index.html
    gulp.src('./index.html')
        // And put it in the dist folder
        .pipe(gulp.dest('./build'))
        .pipe(notify({
            message: 'TASK: "Views" Completed! 💯',
            onLast: true
        }));
});

gulp.task('build', ['empty-build','build-template-cache','views','styles', 'VendorJs', 'AppJs']);

gulp.task('watch', function () {
    return gulp.watch(['./index.html','./partials/*.html', './assets/scss/**/*.scss', './assets/js/*.js'], ['build', reload]);
});

gulp.task('default', ['watch', 'build','browser-sync']);