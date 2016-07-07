var yargs = require('yargs').argv;
var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var minifyHtml = require('gulp-minify-html');

var option = {base: 'src'}; //基准目录从src目录开始
var dist = __dirname + '/dist';

gulp.task("default", ['release'], function() {
    //执行默认任务之前，你需要执行release任务（完成部署操作）
    if (yargs.s) {
        gulp.start('server');
    }

    if (yargs.w) {
        gulp.start('watch');
    }
    gulp.run('autoUpdateSource');
});

gulp.task("transformLess", function() {
    //gulp.src("src/style/**/*.less")//找到关于所有less的发源地
    //.pipe(less())//把所有less文件转化css文件
    //.pipe(gulp.dest(dist));
    //如果说你直接这么执行，会在dist目录下发现这样的文件结果：
     /*dist
        home
            header.css*/

    gulp.src("src/style/**/*.less", option)//找到关于所有less的发源地
    .pipe(less())//把所有less文件转化css文件
    .pipe(autoprefixer()) //自动匹配前缀操作
    .pipe(gulp.dest(dist))
    .pipe(concat('index_all.min.css'))
    .pipe(minify())//压缩css操作
    .pipe(gulp.dest(dist+'/style'))
    .pipe(browserSync.reload({stream: true})); //自动进行同步操作
     /*dist
        style
            home
                header.css*/

});
gulp.task("release", function(){
    //发布、部署操作 --》 就是要把src里面的内容全部转移到dist里去
    gulp.run('html');
    gulp.run('transformLess');
    gulp.run('img');
    gulp.run('js');
})
gulp.task("styles", function(){
    //样式的发布任务

})

gulp.task("html", function(){
    gulp.src("src/*.html") //找到src下所有的html的发源地
    .pipe(minifyHtml()) //进行html压缩工作，目的在于加速传输速度
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({stream: true}));//当监听到html文件变化的时候，执行同步更新操作
})
gulp.task("img", function(){
    gulp.src("src/img/**/*", option).pipe(gulp.dest(dist))       
})

gulp.task("js", function(){
    gulp.src("src/js/**/*", option).pipe(gulp.dest(dist))       
})
//自动更新资源文件，比如js/less
gulp.task('autoUpdateSource', function(){
    //单独的监听所有与less相关的文件，做到对less转成css的工作
    gulp.watch("src/style/**/*.less", ['transformLess'])
    //单独的监听所有与html相关的文件，若改变，执行html任务
    gulp.watch("src/*.html", ['html'], function(){
        
       
    });
});

gulp.task('cleanTask', function(){
    return gulp.src(dist).pipe(clean());
});

gulp.task('server', function () {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: "./dist" //--> localhost:8080/
        },
        port: yargs.p,
        startPath: './'
    });
});