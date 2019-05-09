process.env.NODE_PATH = `${__dirname}:${__dirname}/node_modules`

const gulp       = require('gulp')
const browserify = require('browserify')
const globify    = require('require-globify')
const riotify    = require('riotify')
const hmr        = require('browserify-hmr')
const watchify   = require('watchify')
const source     = require('vinyl-source-stream')
const nodemon    = require('gulp-nodemon')

gulp.task('start', function (done) {
  gulp.task('default')()
  return nodemon({
    script: 'index.js'
  , args: ['./config.env']
  , ignore: ['node_modules/', 'assets/']
  , ext: 'js ejs riot json jss env'
  , env: { 'NODE_ENV': 'development' }
  , done: done
  })
})

gulp.task('build', function(){

  return browserify({ entries: ['pages/index.js'] })
    .transform(globify)
    .transform(riotify) // pass options if you need
    .transform('uglifyify', { sourceMap: false })
    .bundle()
    .pipe(require('minify-stream')({ sourceMap: false }))
    .pipe(source('pages/index.js'))
    .pipe(gulp.dest('assets/'))
})

gulp.task('default', function(){
  const b = browserify({ 
      entries: ['pages/index.js'],
      plugin: [hmr, watchify], // load hmr as plugin
      debug: true,
      cache: {},
      packageCache: {}
    })
    .transform(globify)
    .transform(riotify) // pass options if you need
  
  const bundle = () => {
    b.bundle()
    .pipe(source('pages/index.js'))
    .pipe(gulp.dest('assets/'))
  }
  bundle()
  b.on('update', bundle)
  
})