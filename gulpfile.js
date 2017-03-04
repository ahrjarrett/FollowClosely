var requireDir = require('require-dir');
var gulp = require('gulp');

requireDir('./gulp/tasks', {recurse: true});

gulp.task('default', ['sass', 'ghost']);