const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-minify');

gulp.task('toes5', () =>
	gulp.src('lib/**/*.js')
		.pipe(babel({
			presets: ['babel-preset-env'],
			plugins: ['babel-plugin-transform-object-rest-spread']
		}))
		.pipe(minify())
		.pipe(gulp.dest('es'))
);

gulp.task('copyJson', () => {
	gulp.src('lib/**/*.json')
		.pipe(gulp.dest('es'))	
});

gulp.task('default', ['toes5', 'copyJson']);