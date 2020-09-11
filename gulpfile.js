const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const notifier = require("node-notifier");

sass.compiler = require("sass");

function server(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    cb();
}

function notifyError(err) {
    console.log(err.messageFormatted);
    notifier.notify({
        title: "Błąd",
        message: err.formatted
    });
}

function makeCss() {
    return gulp
        .src("./scss/main.scss")
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({ outputStyle: "expanded" }).on("error", notifyError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());
}

// gulp.series(makeCss)
// gulp.parallel(makeCss)

function watch(cb) {
    gulp.watch("./scss/**/*.scss", makeCss);
    gulp.watch("./**/*.js").on("change", browserSync.reload);
    gulp.watch("./*.html").on("change", browserSync.reload);

    cb();
}

module.exports.makeCss = makeCss;
module.exports.watch = watch;
module.exports.default = gulp.series(server, makeCss, watch);
