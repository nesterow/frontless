const gulp       = require('gulp')
const browserify = require('browserify')
const riotify    = require('riotify')
const source     = require('vinyl-source-stream')

gulp.task('default', function(){
  return browserify({ entries: ['pages/index.js'] })
    .transform(riotify) // pass options if you need
    .bundle()
    .pipe(source('pages/index.js'))
    .pipe(gulp.dest('assets/'))
})