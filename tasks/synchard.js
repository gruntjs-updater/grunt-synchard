/*
 * grunt-synchard
 * https://github.com/reidransom/grunt-synchard
 *
 * Copyright (c) 2013 Reid Ransom
 * Licensed under the MIT license.
 */

'use strict'

var rsync = require('rsyncwrapper').rsync

function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('synchard', 'rsync task handler.', function() {
        
        // Merge task-specific and/or target-specific options with these defaults.
        var done = this.async(),
            options = this.options({
                args: ['--archive']
            })

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            
            var grpoptions = clone(options)
            grpoptions.src = []
            grpoptions.dest = './' + f.dest

            // Concat specified files.
            f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.')
                    return false
                }
                else {
                    grpoptions.src.push('./' + filepath)
                    return true
                }
            })
            // Write the destination file.
            if (!grunt.file.exists(grpoptions.dest)) {
                grunt.file.mkdir(grpoptions.dest, '0755')
            }
            rsync(grpoptions, function(error, stdout, stderr, cmd) {
                grunt.log.writeln(cmd)
                stdout = stdout.trim()
                if (stdout) {
                    grunt.log.writeln(stdout)
                }
                if (error) {
                    grunt.log.warn(stderr)
                    done(false)
                }
                else {
                    done(true)
                }
            })
        })
    
    })

}
