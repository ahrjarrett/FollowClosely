var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');

var sassSrc = "./app/assets/sass/style.scss";
var sassDest = "./app/assets/css/";

gulp.task('sass', function(){
  return gulp
    .src(sassSrc)
    .pipe(sass())
		.pipe(rename('stylez.css'))
		.pipe(gulp.dest(sassDest))
		.pipe(rename('stylez.min.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest(sassDest));
});