const gulp = require("gulp");
const zip = require("gulp-zip");

gulp.task('zip', () =>
    gulp.src([
        'dist/**/*',
        'src/**/*',
        '.ebextensions/**/*',
        '!src/app/**',
        '!src/environments/**',
        '!src/*.ico',
        '!src/*.html',
        '!src/*.js',
        '!src/*.ts',
        '!src/*.scss',
        '!src/*.json',
        '!src/browserslist',
        '{package.json,package-lock.json}'
    ], {base: '.'})
    .pipe(zip('deploy.zip'))
    .pipe(gulp.dest('./'))
);
