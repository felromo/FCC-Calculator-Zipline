module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        express: {
            dev: {
              options: {
                script: 'dev/server.js'
              }
            },
            prod: {
              options: {
                script: 'path/to/prod/server.js',
                node_env: 'production'
              }
            },
            test: {
              options: {
                script: 'path/to/test/server.js'
              }
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dev/public/includes/main.css': 'dev/public/includes/main.scss'
                }
            }
        },
        watch: {
            express: {
                files: ['**/*.js', '**/*.html', '**/*.css'],
                tasks: ['express:dev'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['**/*.scss'],
                tasks: ['sass:dev']
            }
        },
    });
    
    
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.registerTask('server', ['express:dev', 'watch']);
};
