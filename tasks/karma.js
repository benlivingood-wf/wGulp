module.exports = function(gulp, options, subtasks) {

    var _ = require('lodash');
    var cwd = process.cwd();
    var glob = require('glob');
    var gutil = require('gulp-util');
    var karma = require('gulp-karma');
    var path = require('path');

    var taskname = 'karma';

    gulp.desc(taskname, 'Start the karma test runner for any test run');

    var fn = function (done) {

        // Check for test specs. If none, skip Karma
        if(_.isArray(options.glob.spec)){
            if(_.every(_.map(options.glob.spec, function(specStr){
                return _.isEmpty(glob.sync(specStr, {cwd: options.path.test}));
            }))){
                gutil.log(gutil.colors.yellow("No tests found. Skipping Karma."));
                done();
                return;
            }
        } else {
            if(_.isEmpty(glob.sync(options.glob.spec, {cwd: options.path.test}))){
                gutil.log(gutil.colors.yellow("No tests found. Skipping Karma."));
                done();
                return;
            }
        }

        // get files from karma config
        var karmaShim = {set: function(config) { this.config = config; }};
        var karmaConf = require(path.resolve(cwd, 'node_modules/wGulp/karma.conf.js'));
        karmaConf(karmaShim);
        var files = karmaShim.config.files;

        return gulp.src(files)
            .pipe(karma({
                configFile: options.karma,
                action: 'run'
            }));
    };

    gulp.task(taskname, fn);
};
