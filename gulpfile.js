const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
const livereload = require('gulp-livereload');
const Cache = require('gulp-file-cache');

const cache = new Cache();

gulp.task('compile', function () {
  return tsProject.src()
    .pipe(cache.filter())
    .pipe(tsProject()).js
    .pipe(cache.cache())
    .pipe(gulp.dest(tsProject.options.outDir));
});

gulp.task('develop', () => {
  livereload.listen();
  nodemon({
    script: 'dist/app/bin/www.js',
    ext: 'js,ts',
    stdout: false,
    watch: ['src/app'],
    tasks: ['compile']
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

gulp.task('default', gulp.parallel('develop'));
