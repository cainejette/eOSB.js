const gulp = require('gulp');
const childProcess = require('child_process');
const electron = require('electron');

gulp.task('run', function () { 
  childProcess.spawn(electron, ['--debug=5858', './app'], { stdio: 'inherit' }); 
});