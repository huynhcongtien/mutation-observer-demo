'use strict';

module.exports = function (grunt) {

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function (string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    // load environment in file
    var env = require('node-env-file');
    env(__dirname + '/.env');

    // Configurable paths for the app
    var appConfig = {
        app: 'app',
        dist: 'public',
        build: 'build',
        debug: {
            port: 5000
        }
    };

    var deployTime  = '20170825';
    var deployDir   = {
        dev: 'deploys/' + deployTime + '/development',
        pro: 'deploys/' + deployTime + '/production'
    };
    var deployConfig = {
        dev: {
            env: deployDir.dev + '/.env'
        },
        pro: {
            env: deployDir.pro + '/.env'
        }
    };

    // Project configuration.
    grunt.initConfig({

        // Project settings
        theme: appConfig,

        // deploy setting
        deploy: deployConfig,

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            ' * <%= pkg.description %> v<%= pkg.version %>\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',

        /**
         * Task configuration.
         */
        // Clean dist folder
        clean: {
            build: '<%= theme.build %>',
            public_files: [
                '<%= theme.dist %>'
            ]
        },

        copy: {
            pro: {
                files: [
                    {   // copy .env
                        expand: true,
                        flatten: true,
                        dest: '',
                        src: [
                            '<%= deploy.pro.env %>'
                        ]
                    },
                    {   // copy lib css
                        expand: true,
                        cwd: 'node_modules',
                        flatten: true,
                        dest: '<%= theme.build %>/css/',
                        src: [
                            'bootstrap/dist/css/bootstrap.css'
                        ]
                    },
                    {   // copy lib js
                        expand: true,
                        cwd: 'node_modules',
                        flatten: true,
                        dest: '<%= theme.build %>/js/',
                        src: [
                            'bootstrap/dist/js/bootstrap.js',
                            'jquery/dist/jquery.js'
                        ]
                    }
                ]
            },
            dev: {
                files: [
                    {   // copy .env
                        expand: true,
                        flatten: true,
                        dest: '',
                        src: [
                            '<%= deploy.dev.env %>'
                        ]
                    }
                ]
            }
        },

        sass: {
            dist: {
                options: {
                    sourcemap: 'none',
                    style: 'expanded' // expanded
                },
                files: {
                    '<%= theme.build %>/css/style.css': '<%= theme.app %>/scss/*.scss'
                }
            }
        },

        cssmin: {
            options: {
                specialComments: 0
            },
            pro: {
                dest: '<%= theme.dist %>/css/core.min.css',
                src: [
                    '<%= theme.build %>/css/bootstrap.css',
                    '<%= theme.build %>/css/style.css'
                ]
            },
            dev: {
                dest: '<%= theme.dist %>/css/core.min.css',
                src: [
                    '<%= theme.build %>/css/bootstrap.css'
                ]
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                compress: {
                    warnings: false
                },
                report: 'min',
                mangle: true
            },
            pro: {
                files: {
                    '<%= theme.dist %>/js/core.min.js': [
                        '<%= theme.build %>/js/jquery.js',
                        '<%= theme.build %>/js/bootstrap.js',
                        '<%= theme.app %>/js/script.js'
                    ]
                }
            },
            dev: {
                files: {
                    '<%= theme.dist %>/js/core.min.js': [
                        '<%= theme.build %>/js/jquery.js',
                        '<%= theme.build %>/js/bootstrap.js'
                    ]
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '<%= theme.app %>/rc/.jshintrc'
            },
            assets: {
                src: [
                    '<%= theme.app %>/js/script.js'
                ]
            }
        },

        // Watch for changes in live edit
        watch: {
            options: {
                livereload: parseInt(process.env.LIVERELOAD_PORT)
            },
            css: {
                files: [
                    '<%= theme.build %>/css/style.css'
                ]
            },
            sass: {
                files: [
                    '<%= theme.app %>/scss/style.scss'
                ],
                options: {
                    livereload: false
                },
                tasks: [
                    'sass'
                ]
            },
            js: {
                files: [
                    '<%= theme.app %>/js/script.js'
                ]
            },
            html: {
                files: [
                    'index.html'
                ]
            },
            grunt: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        }
    });

    // Load the Grunt plugins.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // Show grunt task time.
    require('time-grunt')(grunt);

    // Register the default tasks.
    grunt.registerTask('default', ['clean', 'copy:pro', 'sass', 'cssmin:pro', 'uglify:pro']);
    grunt.registerTask('cop', ['clean', 'copy']);
    grunt.registerTask('dev', ['clean', 'copy:pro', 'copy:dev', 'cssmin:dev', 'sass', 'uglify:dev']);
    grunt.registerTask('live', ['dev', 'watch']);

};
