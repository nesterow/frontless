process.env.NODE_PATH = `${__dirname}:${__dirname}/components:${__dirname}/node_modules`


const { spawn, exec } = require('child_process');
const gulp       = require('gulp')
const browserify = require('browserify')
const babelify    = require('babelify')
const globify    = require('require-globify')
const riotify    = require('riotify')
const hmr        = require('browserify-hmr')
const watchify   = require('watchify')
const source     = require('vinyl-source-stream')
const nodemon    = require('gulp-nodemon')

const sass = require('gulp-sass')
const cleancss = require('gulp-clean-css')
const csscomb = require('gulp-csscomb')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')


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


gulp.task('build', function(){

  return browserify({ entries: ['pages/index.js'] })
    .transform(babelify.configure({
      presets: ["@babel/preset-env"]
    }))
    .transform(globify)
    .transform(riotify) // pass options if you need
    // .plugin('tinyify', { flat: false })
    .bundle()
    .pipe(require('minify-stream')({ sourceMap: false }))
    .pipe(source('application.js'))
    .pipe(gulp.dest('assets/'))
})



gulp.task('worker', function(){
  return browserify({ entries: ['components/webworker/index.js'] })
    .transform(babelify.configure({
      presets: ["@babel/preset-env"]
    }))
    .bundle()
    .pipe(source('worker.js'))
    .pipe(gulp.dest('assets/'))
})



gulp.task('boot', function(){
  return browserify({ entries: ['components/webworker/boot.js'] })
    .transform(babelify.configure({
      presets: ["@babel/preset-env"]
    }))
    .bundle()
    .pipe(source('boot.js'))
    .pipe(gulp.dest('assets/'))
})



gulp.task('default', async function(done){
  
  gulp.task('scss')()
  gulp.task('worker')()
  gulp.task('boot')()

  const b = browserify({ 
      entries: ['pages/index.js'],
      debug: true,
      cache: {},
      packageCache: {}
    })
    .plugin(watchify, {
      delay: 100,
      ignoreWatch: ['**/node_modules/**', '**/assets/**'],
    })
    .plugin(hmr)
    .transform(babelify.configure({
      presets: ["@babel/preset-env"]
    }))
    .transform(globify)
    .transform(riotify) // pass options if you need
  
  
  const bundle = async () => {
    await gulp.task('scss')()
    await gulp.task('worker')()
    await gulp.task('boot')()
    server.emit('restart', 'bundle')
    return b.bundle()
    .pipe(source('application.js'))
    .pipe(gulp.dest('assets/'))
  }
  bundle()
  b.on('update', bundle)

  const server = nodemon({
      script: 'index.js'
    , tasks: ['worker', 'boot', 'scss']
    , args: ['./config/environ.env']
    , ignore: ['node_modules/', 'assets/']
    , ext: 'js ejs json jss scss env'
    , env: { 'NODE_ENV': 'development' }
    , done: done
  }).

  on('restart', (files) => {
    if (files === 'bundle') return;
    setTimeout( () => exec('touch pages/index.riot'), 500 )
  })

  return server

  
})



gulp.task('install', ()=>{
  const [a,b,c, repo] = process.argv;
  if (!repo) {
    return console.log(`
    Command syntax:
      gulp install @username/repository
    `)
  } else {
    const target = repo.replace('@', '');
    const path = `components/${target}`
    const repoURL = `git@github.com:${target}.git`
    return runCommand('git', ['clone', repoURL, path])
    .then(() => {
      console.log(target, 'installed!')
      return runCommand('rm', ['-rf', `${path}/.git`]);
    })
  }
})



gulp.task('scss', function() {
  return gulp.src('./styles.scss')
    .pipe(sass({outputStyle: 'compact', precision: 10})
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./assets/css'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/css'));
});
