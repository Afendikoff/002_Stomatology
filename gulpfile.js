var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minify = require("gulp-csso"),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  plumber = require('gulp-plumber'),
  rsync = require('gulp-rsync'),
  del = require('del'),
  imagemin = require("gulp-imagemin"),
  run = require('run-sequence');


//---------------------- WORK ----------------------

//живой сервер
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

//сборка скриптов
gulp.task('js', function () {
  return gulp.src([
      'app/libs/jquery/dist/jquery.min.js',
      'app/libs/slick-carousel/slick/slick.min.js',
      'app/js/main.js', // Always at the end
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify()) // Mifify js (opt.)
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

//сборка стилей
gulp.task("style", function () {
  gulp.src('app/scss/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(minify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.stream());
});

//деплой
gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

//отслеживание изменений
gulp.task('watch', ['style', 'js', 'browser-sync'], function() {
	gulp.watch('app/scss/**/*.scss', ['style']);
	gulp.watch(['libs/**/*.js', 'app/js/main.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload)
});

//дефолтный таск
gulp.task('default', ['watch']);




//---------------------- BUILD ----------------------

var path = {
  build: { //Тут мы укажем куда складывать готовые после сборки файлы
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/',
    slick: 'build/slick/'
  },
  app: { //Пути откуда брать исходники
    html: 'app/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    css: 'app/css/',
    js: 'app/js/main.js', //В стилях и скриптах нам понадобятся только main файлы
    style: 'app/scss/main.scss',
    img: 'app/img/**/*.*',
    fonts: 'app/fonts/**/*.*',
    slick: 'app/slick/**/*.*'
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: 'app/**/*.html',
    css: 'app/css/',
    js: 'app/js/**/*.js',
    style: 'app/scss/**/*.scss',
    img: 'app/img/**/*.*',
    fonts: 'app/fonts/**/*.*'
  },
  clean: './build'
};

gulp.task('js:build', function () {
  gulp.src(path.app.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({
      stream: true
    }));
});

//сборка стилей
gulp.task("style:build", function () {
  gulp.src(path.app.style)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({
      stream: true
    }));
});

//сборка изображений
gulp.task("img:build", function () {
  gulp.src(path.app.img)
    .pipe(gulp.dest(path.build.img));
});

//оптимизация и сборка изображений
gulp.task("imgmin:build", function () {
  gulp.src(path.app.img)
    .pipe(imagemin([
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest(path.build.img));
});

//копируем шрифты
gulp.task('fonts:build', function () {
  gulp.src(path.app.fonts)
    .pipe(gulp.dest(path.build.fonts))
});



//сборка всего проекта
gulp.task('build', function (done) {
  run(
    "clean",
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'slick:build',
    'img:build',
    done
  );
});

//отслеживание изменений файлов
gulp.task('watch1', function () {
  gulp.watch([path.watch.html], ["html:build"]);
  gulp.watch([path.watch.js], ["js:build"]);
  gulp.watch([path.watch.style], ["style:build"]);
  gulp.watch([path.watch.img], ["img:build"]);
  gulp.watch([path.watch.fonts], ["fonts:build"]);

});

//локальный сервер
gulp.task('webserver', function () {
  browserSync(config);
  gulp.watch([path.watch.html], ["html:build"]);
  gulp.watch([path.watch.js], ["js:build"]);
  gulp.watch([path.watch.style], ["style:build"]);
  gulp.watch([path.watch.img], ["img:build"]);
  gulp.watch([path.watch.fonts], ["fonts:build"]);
});

//очистка папки build
gulp.task('clean', function () {
  return del('build');
});

//дефолтный таск
gulp.task('default1', ['watch', 'webserver']);

//деплой
gulp.task('rsync', function () {
  return gulp.src('app/**')
    .pipe(rsync({
      root: 'app/',
      hostname: 'username@yousite.com',
      destination: 'yousite/public_html/',
      // include: ['*.htaccess'], // Includes files to deploy
      exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    }))
});



//сборка html
gulp.task('html:build', function () {
  gulp.src(path.app.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
});
