const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
var ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
const livereload = require('gulp-livereload');


gulp.task('develop', () => {
  livereload.listen();
  nodemon({
    script: 'bin/www.js',
    ext: 'js,ts',
    stdout: false,
    ignore: ['./test/']
  }).on('readable', function () {
    this.stdout.on('data', (chunk) => {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('build', ['clean'], function () {

  var tsProject = ts.createProject('tsconfig.json');

  var tsResult = tsProject.src()
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest('output'));

});

gulp.task('default', gulp.parallel('develop'));
