// gulp
const {src, dest, watch, series, parallel} = require('gulp')
// plugins
const browserSync = require('browser-sync').create()
const sass        = require('gulp-sass')(require('sass'));
const cssMin      = require('gulp-clean-css')
const concat      = require('gulp-concat')
const rename      = require('gulp-rename')
const pug         = require('gulp-pug')
const imagemin    = require('gulp-imagemin')
const del         = require('del')
const newer       = require('gulp-newer')
const autoprefixer= require('gulp-autoprefixer')
const uglify      = require('gulp-uglify-es').default

// paths in 'dir/sub_dir' format
const imagesSrc            = `src/images`
const imagesDest           = `dist/images`

const styleSrc             = `src/scss`
const styleSrcFile         = `app.scss`
const styleDest            = `dist/css`
const styleDestFile        = `app.min.css`

const markupSrc            = `src/pug`
const markupSrcFile        = `index.pug`
const markupDest           = `dist`
const markupDestFile       = `index.html`

const scriptsSrc           = `src/scripts`
const scriptsDest          = `dist/scripts`

const distDir              = `dist`

// liveServer
function browserSyncInit() {
  browserSync.init(
    {
      server : {baseDir: `${distDir}`},
      online: true,
      open: false,
      notify: false,
    }
  )
}

// image manipulations
function images() {
  return src(`${imagesSrc}/**/*`)
  .pipe(newer(`${imagesDest}/`))
  .pipe(imagemin())
  .pipe(dest(`${imagesDest}/`))
}

function cleanImages() {
  return del(`${imagesDest}/**/*`)
}

// converters
//scss to css
function styles() {
  return src([
    `${styleSrc}/**/*.*`,
    `!${styleSrc}/**/_*`
  ])
  .pipe(sass.sync())
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 15 versions'], grid: true
  }))
  .pipe(cssMin())
  .pipe(rename({
    suffix: '.min', 
  }))
  .pipe(dest(`${styleDest}/`))
}

function cleanStyles() {
  return del(`${styleDest}/**/*`)
}

//pug to html
function markup() {
  return src([
    `${markupSrc}/**/*.*`,
    `!${markupSrc}/**/_*`
  ])
  .pipe(pug())
  .pipe(dest(`${markupDest}/`))
} 

function cleanMarkup() {
  return del(`${markupDest}/${markupDestFile}`)
}

function scripts () {
  return src([
    `${scriptsSrc}/**/*.js`,
    `!${scriptsSrc}/**/_*`
  ])
  .pipe(uglify())
  .pipe(dest(`${scriptsDest}/`))
}

// watch
function watchFiles() {
  //style
  watch([
    `${styleSrc}/*.scss`
  ], styles).on('change', browserSync.reload)
  //markup
  watch([
    `${markupSrc}/*.pug`
  ], markup).on('change', browserSync.reload)
  //scripts
  watch([
    `${scriptsSrc}/**/*.js`
  ], scripts).on('change', browserSync.reload)
  //images
  watch([
    `${imagesSrc}/**/*`
  ], images).on('change', browserSync.reload)
}


// dist
async function buildDist() {
  return parallel(images, styles, markup, scripts)()

}


function cleanDist() {
 return del(`${distDir}/**/*`)
}

async function rebuildDist() {
  return series(cleanDist, buildDist)()
}

// exports

exports.styles             = styles
exports.markup             = markup
exports.liveserver         = browserSyncInit
exports.images             = images
exports.cleanImages        = cleanImages
exports.cleanStyles        = cleanStyles
exports.cleanMarkup        = cleanMarkup
exports.rebuildDist        = rebuildDist
exports.buildDist          = buildDist
exports.cleanDist          = cleanDist

// on start
exports.default = parallel(buildDist, browserSyncInit, watchFiles)