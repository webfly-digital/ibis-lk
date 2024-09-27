const gulp = require('gulp')

// tasks
require('./gulp/dev.js')
require('./gulp/docs.js')

gulp.task('default', 
    gulp.series('build:dev',
        gulp.parallel('watch:dev', 'server:dev')
    )
)

gulp.task('build', 
    gulp.series('build:build',
        gulp.parallel('server:build')
    )
)