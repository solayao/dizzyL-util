const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-minify');

gulp.task('toes5', () =>
	gulp.src(['es/**/*.js', '!es/crawler/*.js', '!es/dbs/*.js', '!es/log/*.js'])
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['babel-plugin-transform-object-rest-spread']
		}))
		.pipe(minify())
		.pipe(gulp.dest('lib'))
);

gulp.task('copyJson', () => {
	gulp.src(['es/**/*.json', '!es/dbs/*.json', '!es/log/*.json'])
		.pipe(gulp.dest('lib'))	
});

gulp.task('default', ['toes5', 'copyJson']);