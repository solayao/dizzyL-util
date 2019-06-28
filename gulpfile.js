const gulp = require('gulp');
const babel = require('gulp-babel');
const minify = require('gulp-minify');

gulp.task('toes5', (done) => {
	gulp.src(['es/**/*.js', '!es/crawler/*.js', '!es/dbs/*.js', '!es/log/*.js'])
		.pipe(babel({
			presets: ['env'],
			plugins: ['babel-plugin-transform-object-rest-spread']
		}))
		.pipe(minify())
		.pipe(gulp.dest('lib'));
	done();
});

gulp.task('copyJson', (done) => {
	gulp.src(['es/**/*.json', '!es/dbs/*.json', '!es/log/*.json'])
		.pipe(gulp.dest('lib'));
	done();
});

gulp.task('default', gulp.series(gulp.parallel('toes5', 'copyJson')));