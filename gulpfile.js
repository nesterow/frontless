process.env.NODE_PATH = `${__dirname}:${__dirname}/node_modules`
const { spawn } = require('child_process');
const gulp       = require('gulp')
const browserify = require('browserify')
const globify    = require('require-globify')
const riotify    = require('riotify')
const hmr        = require('browserify-hmr')
const watchify   = require('watchify')
const source     = require('vinyl-source-stream')
const nodemon    = require('gulp-nodemon')

function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    spawned.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    spawned.on('close', () => {
      resolve();
    });
  });
}

gulp.task('start', function (done) {
  gulp.task('default')()
  gulp.task('worker')()
  gulp.task('boot')()
  return nodemon({
    script: 'index.js'
  , tasks: ['worker', 'boot']
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
    .plugin('tinyify', { flat: false })
    .bundle()
    .pipe(require('minify-stream')({ sourceMap: false }))
    .pipe(source('application.js'))
    .pipe(gulp.dest('assets/'))
})

gulp.task('worker', function(){
  return browserify({ entries: ['components/webworker/index.js'] })
    .bundle()
    .pipe(source('worker.js'))
    .pipe(gulp.dest('assets/'))
})

gulp.task('boot', function(){
  return browserify({ entries: ['components/webworker/boot.js'] })
    .bundle()
    .pipe(source('boot.js'))
    .pipe(gulp.dest('assets/'))
})

gulp.task('default', function(){
  const b = browserify({ 
      entries: ['pages/index.js'],
      plugin: [
        hmr, 
        watchify
      ], // load hmr as plugin
      debug: true,
      cache: {},
      packageCache: {}
    })
    .transform(globify)
    .transform(riotify) // pass options if you need
  
  const bundle = () => {
    b.bundle()
    .pipe(source('application.js'))
    .pipe(gulp.dest('assets/'))
  }
  bundle()
  b.on('update', bundle)
  
})

gulp.task('install', ()=>{
  const [a,b,c, repo] = process.argv;
  if (!repo) {
    return console.log(`
    Command syntax:
      gulp install --username/repository
    `)
  } else {
    const target = repo.replace('--', '');
    const path = `components/${target}`
    const repoURL = `git@github.com:${target}.git`
    return runCommand('git', ['clone', repoURL, path])
    .then(() => {
      console.log(target, 'installed!')
      return runCommand('rm', ['-rf', `${path}/.git`]);
    })
  }
})