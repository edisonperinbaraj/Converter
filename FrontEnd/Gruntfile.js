module.exports = function (grunt) {
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
 
        clean: ["dist", '.tmp'],
 
        copy: {
            main: {
                expand: true,
                cwd: '',
                src: ['**', '!js/**', '!lib/**', '!**/*.css'],
                dest: 'dist/'
            },
            shims: {
                expand: true,
                cwd: 'js/polyfills/shims',
                src: ['**'],
                dest: 'dist/js/polyfills/shims'
            }
        },
 
        rev: {
            files: {
                src: ['dist/**/*.{js,css}', '!dist/js/shims/**']
            }
        },
 
        useminPrepare: {
           foo: {
			src: ['login.htm']
		  },
		  options: {
			    flow: {
			      // i'm using this config for all targets, not only 'html'
			      steps: {
			        // Here you define your flow for your custom block - only concat
			    	  asyncjs: ['concat'],
			        // Note that you NEED to redefine flow for default blocks... 
			        // These below is default flow.
			        js: ['concat', 'uglifyjs'],
			        css: ['concat', 'cssmin']
			      },
			      // also you MUST define 'post' field to something not null
			      post: {}
			    }
			  }
        },
 
        usemin: {
            html: ['dist/login.htm','dist/home.htm','dist/change-password.htm','dist/settings.htm','dist/forgot-password.htm','dist/decision-workbench.htm','dist/tracking.htm'],
            options: {
                blockReplacements: {
                  asyncjs: function (block) {
                      return '<script async src="' +block.dest+ '"></script>';
                  }
                }
              }
        },
 
        uglify: {
            options: {
                report: 'min',
                mangle: false,
            	compress: {
            		sequences: true,
            		dead_code: true,
            		conditionals: true,
            		booleans: true,
            		unused: true,
            		if_return: true,
            		join_vars: true,
            		drop_console: true
            	}
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
	
 
    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'copy', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'rev', 'usemin'
    ]);
};