const gulp = require("gulp");
const babel = require("gulp-babel");
const minify = require("gulp-minify");
const del = require("del");

gulp.task("clean:build", async done => {
  await del(
    [
      // 使用一个通配模式来匹配 `lib` 文件夹中的所有东西
      "lib/**"
    ],
    done
  );
});

gulp.task("toes5", done => {
  gulp
    .src(["es/**/*.js"])
    .pipe(
      babel({
        presets: ["env"],
        plugins: ["babel-plugin-transform-object-rest-spread"]
      })
    )
    .pipe(minify())
    .pipe(gulp.dest("lib"));
  done();
});

gulp.task("copyJson", done => {
  gulp.src(["es/**/*.json"]).pipe(gulp.dest("lib"));
  done();
});

gulp.task(
  "default",
  gulp.series(gulp.parallel("clean:build", "toes5", "copyJson"))
);
