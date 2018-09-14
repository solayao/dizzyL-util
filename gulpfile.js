const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-minify');

gulp.task('toes5', () =>
	gulp.src('es/**/*.js')
		.pipe(babel({
			presets: ['babel-preset-env'],
			plugins: ['babel-plugin-transform-object-rest-spread']
		}))
		.pipe(minify())
		.pipe(gulp.dest('lib'))
);

gulp.task('copyJson', () => {
	gulp.src('es/**/*.json')
		.pipe(gulp.dest('lib'))	
});

gulp.task('default', ['toes5', 'copyJson']);