module.exports = function (grunt) {
	"use strict";

	// 1. All configuration goes here 
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			// 定义用于检测的文件
			files: ['Gruntfile.js'],
			// files: ['Gruntfile.js', 'public/javascripts/*.js', 'routes/*.js', 'services/*.js', 'proxy/*.js', 'models/*.js', 'lib/*.js'],
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			}
		},
		// js代码压缩
		uglify: {
			options: {
				//生成一个banner注释并插入到输出文件的顶部
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			main: {
				files: {
					'public/javascripts/build/main.min.js': ['public/javascripts/main.js']
				}
			},
			starPost: {
				files: {
					'public/javascripts/build/starPost.min.js': ['public/javascripts/starPost.js']
				}
			}
		},
		// css代码前缀补全
		autoprefixer: {
			options: {
				browsers: ['last 2 version', '> 5%', 'ie 8', 'ie 9']
			},
			// 没有提供dest将默认覆盖源文件
			style: {
				expand: true,
				flatten: true,
				src: ['public/stylesheets/style.css'],
				dest: 'public/stylesheets/autoprefix'
			}
		},
		// css联合压缩,按顺序压缩
		cssmin: {
			min: {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
				},
				files: {
					'public/stylesheets/build/style.min.css': ['public/stylesheets/autoprefix/style.css', 'public/stylesheets/Github2.css']
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			jshint: {
				files: [
					'<%= jshint.files %>'
				],
				tasks: ['jshint'],
				options: {
					spawn: false,
				}
			},
			uglifyMain: {
				files: ['public/javascripts/main.js'],
				tasks: ['uglify:main'],
				options: {
					spawn: false,
				}
			},
			uglifyStarPost: {
				files: ['public/javascripts/starPost.js'],
				tasks: ['uglify:starPost'],
				options: {
					spawn: false,
				}
			},
			css: {
				files: ['public/stylesheets/style.css', 'public/stylesheets/Github2.css'],
				tasks: ['autoprefixer', 'cssmin'],
				options: {
					spawn: false,
				}
			} 
		},
		// 清除文件和目录
		clean: {
			build: ['public/javascripts/build/main.min.js', 'public/javascripts/build/starPost.min.js', 'public/stylesheets/autoprefix/*.css', 'public/stylesheets/build/style.min.css'],
			release: []
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('build', ['jshint', 'uglify', 'autoprefixer', 'cssmin']);
	grunt.registerTask('default', ['jshint', 'uglify', 'autoprefixer', 'cssmin', 'watch']);
};
