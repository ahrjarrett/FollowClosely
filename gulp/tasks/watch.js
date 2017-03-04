var gulp = require('gulp');

gulp.task('ghost', ['ghost:start'], function (callback) {
  gulp.watch('app/**/*.hbs', ['browsersync:reload']);
  gulp.watch('app/**/*.css', ['browsersync:reload']);
  gulp.watch('app/**/*.js', ['browsersync:reload']);
  gulp.watch('app/**/*.scss', ['sass']);
  callback();
});