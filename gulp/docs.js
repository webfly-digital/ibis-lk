const gulp = require('gulp')
// const fileInclude = require('gulp-file-include')
const panini = require("panini")

const sass = require('gulp-sass')(require('sass'))
const glob = require('gulp-sass-glob')
const autoprefixer = require("gulp-autoprefixer")
const cssbeautify = require("gulp-cssbeautify")
const removeComments = require("gulp-strip-css-comments")
const sourcemaps = require('gulp-sourcemaps')
const csso = require('gulp-csso')

const uglify = require("gulp-uglify")
const rigger = require("gulp-rigger")
const babel = require('gulp-babel')

const server = require('gulp-server-livereload')
const browserSync = require("browser-sync").create()
const clean = require('gulp-clean')
const fs = require('fs')

const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const webpack = require('webpack-stream')
const changed = require('gulp-changed')

// paths
const srcPath = "src/"
const distPath = "docs/"

const path = {
    dist: {
        html:   distPath,
        css:    distPath + "assets/styles/",
        js:     distPath + "assets/js/",
        images: distPath + "assets/img/",
        fonts:  distPath + "assets/fonts/",
        files:  distPath + "assets/files/"
    },
    src: {
        html:   srcPath + "*.html",
        css:    srcPath + "assets/styles/*.scss",
        js:     srcPath + "assets/js/*.js",
        images: srcPath + "assets/img/**/*.{jpeg,png,svg,gif,ico,webp,webmanifest,xml.json}",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        files:  srcPath + "assets/files/**/*"
    },
    watch: {
        html:   srcPath + "**/*.html",
        css:    srcPath + "assets/styles/**/*.scss",
        js:     srcPath + "assets/js/**/*.js",
        images: srcPath + "assets/img/**/*.{jpeg,png,svg,gif,ico,webp,webmanifest,xml.json}",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        files:  srcPath + "assets/files/**/*"
    },
    clean: "./" + distPath
}

gulp.task('clean:build', function(callback) {
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

gulp.task('html:build', function() {
    panini.refresh()
    return gulp
        .src(path.src.html, {base: srcPath})
        .pipe(changed(path.dist.html, {
            hasChanged: changed.compareContents
        }))
        .pipe(plumber(plumberNotify('HTML')))
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

gulp.task('sass:build', function() {
    return gulp
        .src(path.src.css, {base: srcPath + "assets/styles/"})
        .pipe(glob())
        .pipe(changed(path.dist.css))
        .pipe(plumber(plumberNotify('SASS')))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(removeComments())
        .pipe(csso())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('img:build', function() {
    return gulp
        .src(path.src.images)
        .pipe(changed(path.dist.images))
        .pipe(gulp.dest(path.dist.images))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('fonts:build', function() {
    return gulp
        .src(path.src.fonts)
        .pipe(changed(path.dist.fonts))
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('files:build', function() {
    return gulp
        .src(path.src.files)
        .pipe(changed(path.dist.files))
        .pipe(gulp.dest(path.dist.files))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('js:build', function() {
    return gulp
        .src(path.src.js)
        .pipe(changed(path.dist.js))
        .pipe(sourcemaps.init())
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack({
            mode: "production",
            output: {
              filename: 'main.js',
            }
        }))
        // .pipe(rigger())
        // .pipe(gulp.dest(path.dist.js))
        // .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('server:build', function() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    })
});

gulp.task('build:build', 
    gulp.series('clean:build', 
        gulp.parallel('html:build', 'sass:build', 'img:build', 'js:build', 'fonts:build', 'files:build')
    )
)

