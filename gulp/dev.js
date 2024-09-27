const gulp = require('gulp')
// const fileInclude = require('gulp-file-include')
const panini = require("panini")

const sass = require('gulp-sass')(require('sass'))
const glob = require('gulp-sass-glob')
const sourcemaps = require('gulp-sourcemaps')

const uglify = require("gulp-uglify")
const rigger = require("gulp-rigger")
const babel = require('gulp-babel')
const webpack = require('webpack-stream')

const server = require('gulp-server-livereload')
const browserSync = require("browser-sync").create()
const clean = require('gulp-clean')
const fs = require('fs')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const changed = require('gulp-changed')

// paths
const srcPath = "src/"
const distPath = "build/"

const path = {
    dist: {
        html: distPath,
        css: distPath + "assets/styles/",
        js: distPath + "assets/js/",
        images: distPath + "assets/img/",
        video: distPath + "assets/video/",
        fonts: distPath + "assets/fonts/",
        files: distPath + "assets/files/"
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "assets/styles/*.scss",
        js: srcPath + "assets/js/**/*.js",
        images: srcPath + "assets/img/**/*.{jpeg,png,svg,gif,ico,webp,webmanifest,xml.json}",
        video: distPath + "assets/video/**/*",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        files: srcPath + "assets/files/**/*"
    },
    watch: {
        html: srcPath + "**/*.html",
        css: srcPath + "assets/styles/**/*.scss",
        js: srcPath + "assets/js/**/*.js",
        images: srcPath + "assets/img/**/*.{jpeg,png,svg,gif,ico,webp,webmanifest,xml.json}",
        video: distPath + "assets/video/**/*",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        files: srcPath + "assets/files/**/*"
    },
    clean: "./" + distPath
}

gulp.task('clean:dev', function (callback) {
    if (fs.existsSync(path.dist.html)) {
        return gulp
            .src(path.dist.html, {
                read: false
            })
            .pipe(clean({
                force: true
            }))
    }
    callback()
})

const plumberNotify = (title) => {
    errorHandler: notify.onError({
        title: title,
        message: 'Error <%= error.message %',
        sound: false
    })
}

gulp.task('html:dev', function () {
    panini.refresh()
    return gulp
        .src(path.src.html, { base: srcPath })
        .pipe(changed(path.dist.html, {
            hasChanged: changed.compareContents
        }))
        .pipe(plumber(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "HTML Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        })))
        .pipe(panini({
            root: srcPath,
            layouts: srcPath + "tpl/layouts",
            partials: srcPath + "tpl/partials"
        }))
        .pipe(gulp.dest(path.dist.html))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('sass:dev', function () {
    return gulp
        .src(path.src.css, { base: srcPath + "assets/styles/" })
        .pipe(glob())
        .pipe(changed(path.dist.css))
        .pipe(plumber(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "SASS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        })))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('img:dev', function () {
    return gulp
        .src(path.src.images)
        .pipe(changed(path.dist.images))
        .pipe(gulp.dest(path.dist.images))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('video:dev', function () {
    return gulp
        .src(path.src.video)
        .pipe(changed(path.dist.video))
        .pipe(gulp.dest(path.dist.video))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('fonts:dev', function () {
    return gulp
        .src(path.src.fonts)
        .pipe(changed(path.dist.fonts))
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('files:dev', function () {
    return gulp
        .src(path.src.files)
        .pipe(changed(path.dist.files))
        .pipe(gulp.dest(path.dist.files))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('js:dev', function () {
    return gulp
        .src(path.src.js)
        // .pipe(changed(path.dist.js))
        .pipe(sourcemaps.init())
        .pipe(plumber(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        })))
        .pipe(babel())
        .pipe(webpack({
            mode: "production",
            output: {
                filename: 'main.js',
            }
        }))
        .pipe(rigger())
        .pipe(gulp.dest(path.dist.js))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('server:dev', function () {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    })
});

gulp.task('watch:dev', function () {
    gulp.watch(path.watch.css, gulp.parallel('sass:dev'))
    gulp.watch(path.watch.html, gulp.parallel('html:dev'))
    gulp.watch(path.watch.js, gulp.parallel('js:dev'))
    gulp.watch(path.watch.images, gulp.parallel('img:dev'))
    gulp.watch(path.watch.images, gulp.parallel('video:dev'))
    gulp.watch(path.watch.fonts, gulp.parallel('fonts:dev'))
    gulp.watch(path.watch.files, gulp.parallel('files:dev'))
})

gulp.task('build:dev',
    gulp.series('clean:dev',
        gulp.parallel('html:dev', 'sass:dev', 'img:dev', 'video:dev', 'js:dev', 'fonts:dev', 'files:dev')
    )
)

