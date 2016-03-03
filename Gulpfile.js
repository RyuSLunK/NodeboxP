var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var paths = {
	scss: './sass/*.scss'
};
gulp.task('sass', function(){
	gulp.src('scss/app.scss')
		.pipe(sass({
			includePaths: ['scss']
		}))
		.pipe(gulp.dest('css'));
});
gulp.task('browser-sync', function(){
	browserSync.init(["css/*.css", "js/*.js"], {
		server: {
			baseDir: "./public/"
		}
	});
});
gulp.task('watch', ['sass', 'browser-sync'], function(){
	gulp.watch(["scss/*.scss", "scss/base/*.scss", "scss/sections/*.scss", "scss/style/*.scss"], ['sass']);
});