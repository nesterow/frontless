process.env.NODE_PATH = `${__dirname}:${__dirname}/node_modules`

const gulp       = require('gulp')
const browserify = require('browserify')
const globify    = require('require-globify')
const riotify    = require('riotify')
const source     = require('vinyl-source-stream')
const nodemon    = require('gulp-nodemon')

gulp.task('start', function (done) {
  return nodemon({
    script: 'index.js'
  , args: ['./config.env']
  , ignore: ['node_modules/', 'assets/']
  , ext: 'js ejs riot json env'
  , env: { 'NODE_ENV': 'development' }
  , tasks: ['default']
  , done: done
  })
})

gulp.task('default', function(){
  return browserify({ entries: ['pages/index.js'] })
    .transform(globify)
    .transform(riotify) // pass options if you need
    .bundle()
    .pipe(source('pages/index.js'))
    .pipe(gulp.dest('assets/'))
})