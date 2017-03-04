//NOT IN DEFAULT TASK AT THE MOMENT

var gulp = require('gulp'),
		concat = require('gulp-concat'),
		rename = require('gulp-rename'),
		useref = require('gulp-useref'),
		uglify = require('gulp-uglify'),
		gulpIf = require('gulp-if');

var jsSrc = 'app/assets/js_dev/*.js',
		jsDest = 'app/assets/js';

gulp.task('compile:js', function(){
	return gulp
		.src(jsSrc)
		.pipe(useref())
		.pipe(gulpIf(jsSrc, uglify()))
		.pipe(rename('scriptz.js'))
		.pipe(gulp.dest(jsDest))
		.pipe(rename('scriptz.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(jsDest));
});