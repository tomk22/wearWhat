var gulp = require('gulp'),
    del = require('del'),
    wiredep = require('wiredep').stream,
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    autoPrefix = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    filter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    es = require('event-stream'),
    series = require('stream-series');

//Convert SASS files and store them in .tmp
gulp.task('sass', function(){
  return gulp
          .src('app/styles/**/*.{sass,scss}')
          .pipe(sass())
          .on('error', sass.logError)
          .pipe(gulp.dest('.tmp/styles'));
});

//Clean .tmp directory
gulp.task('clean:tmp', function(){
  return del(['.tmp']);
});

//Start server via browserSync
gulp.task('start:server', function(){
  browserSync({
    server: {baseDir: '.tmp'}
  });
});

//Push new HTML files to .tmp
gulp.task('html', function(){
  return gulp
          .src('app/views/**/*.html')
          .pipe(gulp.dest('.tmp/views'));
});

//Push new JS files to .tmp
gulp.task('js', function(){
  return gulp
          .src('app/scripts/**/*.js')
          .pipe(gulp.dest('.tmp/scripts'));
});

//Compiles and inserts bower files and pushes index.html to .tmp
gulp.task('main:libs', ['bower:css', 'bower:js'], function(){

  //Filter to get jusy lib.js
  var libfilter = filter('.tmp/scripts/lib/*');

  //Store lib.js in jslib var
  var jslib = gulp
            .src('.tmp/scripts/**/*.js', {read: false})
            .pipe(libfilter);

  //Store other sources
  var js = gulp.src(['.tmp/scripts/**/*.js', '!.tmp/scripts/lib/*'], {read: false});
  var csslib = gulp.src('.tmp/styles/lib/*.css', {read: false});
  var css = gulp.src('.tmp/styles/*.css', {read: false});

  //Merge streams
  var allLibs = es.merge(jslib, csslib);
  var allApp = es.merge(js, css);

  return gulp
          .src('app/index.html')
          .pipe(inject(series(allLibs, allApp), {ignorePath: '.tmp'}))
          .pipe(gulp.dest('./.tmp/'))
          .pipe(browserSync.stream());
});

//Compile bower CSS files into lib.css file and insert into .tmp/styles
gulp.task('bower:css', function(){

  var cssFilter = filter('**/*.css');

  return gulp
          .src(mainBowerFiles())
          .pipe(cssFilter)
          .pipe(concat('lib.css'))
          //.pipe(*NEED STANDALONE CSS MINIFYIER*)
          .pipe(gulp.dest('.tmp/styles/lib'));
});

//Bower js files consolidation and insert into scripts/lib
gulp.task('bower:js', function() {

  var jsFilter = filter('**/*.js');

  return gulp
          .src(mainBowerFiles())
          .pipe(jsFilter)
          .pipe(concat('lib.js'))
          //.pipe(uglify())
          .pipe(gulp.dest('.tmp/scripts/lib'));
});

//Build .tmp folder
gulp.task('build:tmp', ['clean:tmp'], function() {
  runSequence(['html', 'sass', 'js'], 'main:libs');
});

//Watch all files for changes and reload browserSync on changes
gulp.task('watch', ['build:tmp'],function(){
  gulp.watch('app/styles/**/*.{sass,scss}', ['sass']).on('change', browserSync.reload);
  gulp.watch(['app/styles/*', 'app/scripts/*'], function(event){
    if(event.type === 'added'){
      gulp.start('main:libs');
    }
  });
  gulp.watch('app/views/**/*.html', ['html']).on('change', browserSync.reload);
  gulp.watch('app/scripts/**/*.js', ['js']).on('change', browserSync.reload);
  gulp.watch(['bower.json', 'app/index.html'], ['main:libs']);
});

//Build .tmp folder and run server
gulp.task('serve', function(){
  runSequence('watch', 'start:server');
});
