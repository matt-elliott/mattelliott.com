var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var del = require("del");
var uglify = require("gulp-uglify");
var pump = require("pump");
var gulpIf = require("gulp-if");
var cssnano = require("gulp-cssnano");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var runSequence = require("run-sequence");
var concat = require("gulp-concat");

gulp.task("browserSync", function() {
	browserSync.init({
		server: {
			baseDir: "app/"
		},
		});
});

gulp.task("sass", function() {
	return gulp.src("app/scss/**/*")
		.pipe(sass())
		.pipe(gulp.dest("app/css"))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task("clean:dist", function() {
	 return del.sync("dist");
});

gulp.task( "watch", ['browserSync', 'sass'], function() {
	gulp.watch("app/scss/*.scss", ["sass"]);
	gulp.watch("app/js/*.js", browserSync.reload);
	gulp.watch("app/*.html", browserSync.reload);
});

gulp.task( "minifycss", function() {
	var loc = gulp.src(["app/css/*", "!app/css/styles.css"])
		.pipe( cssnano() )
		.pipe( concat("styles.css"))
		.pipe( gulp.dest("app/css/"));

	var dev = gulp.src(["app/css/*", "!app/css/styles.css"])
		.pipe( cssnano() )
		.pipe( concat("styles.css"))
		.pipe( gulp.dest("dist"));

	return loc, dev;
});

gulp.task( "minifyjs", function() {
	pump([
		gulp.src('app/js/*'),
		uglify(),
		gulp.dest('dist')
	]);
});

gulp.task("images", function() {
	return gulp.src("app/images/*.+(png|jpg|jpeg|gif|svg)")
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest("dist/images"))
});

gulp.task("fonts", function() {
	return gulp.src("app/fonts/**/*")
		.pipe(gulp.dest("dist/fonts"))	
});

gulp.task("html", function() {
	return gulp.src("app/*.html")
		.pipe(gulp.dest("dist"))
})

gulp.task("build", function(callback) {
	runSequence( "clean:dist", 
		["html","sass","minifycss","minifyjs","images","fonts"],
		callback
	)
});

gulp.task("default", function(callback) {
	runSequence(["html","sass","minifycss","minifyjs","images","fonts"],
		callback
	)
});