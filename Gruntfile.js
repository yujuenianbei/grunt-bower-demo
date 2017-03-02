module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({

//expand：如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
//cwd：需要处理的文件（input）所在的目录。
//src：表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
//dest：表示处理后的文件名或所在目录。
//ext：表示处理后的文件后缀名

        pkg: grunt.file.readJSON('package.json'),


        //模块的合并 js/css
        concat: {
            options: {
                //文件内容的分隔符
                separator: ';',
                stripBanners: true,
                banner: '/* <%= pkg.name %> -v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            jsConcat: {
                src: ['public/js/*.js'],
                dest: 'build/js/<%= pkg.name %>-v<%= pkg.version %>.js'
            },
            //这种合并的话有分号
            //cssConcat: {
            //    src: ['public/css/*.css'],
            //    dest: 'build/css/<%= pkg.name %>.css'
            //}
        },


        //js检测
        jshint:{
            build:['Gruntfile.js','public/js/*.js'],
            options:{
                jshintrc:'.jshint'
            }
        },


        //js文件压缩
        uglify: {
            options: {
                stripBanners:true,
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/js/*.js',
                dest: 'build/js/<%= pkg.name %>-v<%= pkg.version %>.min.js'
            }
        },


        //less转css
        less: {
            main: {
                expand: true,
                src: ['public/css/*.less'],
                dest: '',
                ext: '.css'
            },
            dev: {
                options: {
                    compress: true,
                    yuicompress:true
                }
            }
        },


        //css检测
        csslint:{
            //验证规则
            options:{
                csslintrc:'.csslint'
            },
            build:['build/css/*.css']
        },


        //css压缩
        cssmin: {
            options: {
                stripBanners:true,
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            compress: {
                files: {
                    'build/css/<%= pkg.name %>-v<%= pkg.version %>.min.css': [
                        "public/css/*.css"
                    ]
                }
            }
        },


        //html检测
        htmlhint: {
            options: {
                htmlhintrc: '.htmlhint'
            },
            html: {
                src: ['views/*.html']
            }
        },


        //清除目录
        clean: {
            test: ['build'],
            dest:{
                expand:true
            }
        },

        // 处理html中css、js 引入合并问题
        usemin: {
            html: 'build/html/*.html'
        },

        //单元测试框架qunit
        //qunit: {
        //    all: {
        //        options: {
        //            urls: [
        //                'http://localhost:63342/test/views/index.html'
        //            ]
        //        }
        //    }
        //},

        //connect: {
        //    server: {
        //        options: {
        //            port: 63342,
        //            base: '.'
        //        }
        //    }
        //},

        //自动化
         bower: {
             install: {
                options: {
                    targetDir: 'bower',
                    layout: 'byType',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {},
                    forceLatest:true, //冲突时强制最新版本
                    production:true //不要安装项目devDependencies
                }
            }
        },

        htmlmin: {
            options: {
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            html: {
                files: [
                    {expand: true, cwd: 'views/', src: ['*.html'], dest: 'build/html'}
                ]
            }
        },

        //压缩图片
        //imagemin: {
        //        options: {
        //            optimizationLevel: 7,
        //            pngquant: true
        //        },
        //        files: [
        //            {expand: true, cwd: 'build/images', src: ['images/*.{png,jpg,jpeg,gif,webp,svg}'], dest: 'build/images'}
        //        ]
        //},

        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, cwd: 'bower/', src: ['**'], dest: 'build'},
                    {expand: true, cwd: 'public/', src: ['images/*.{png,jpg,jpeg,gif}'], dest: 'build'}
                ]
            }
        },

        //imagemin: {                          // Task
        //    static: {                          // Target
        //        options: {                       // Target options
        //            optimizationLevel: 3,
        //            svgoPlugins: [{ removeViewBox: false }],
        //            use: [mozjpeg()]
        //        },
        //        files: {                         // Dictionary of files
        //            'dist/img.png': 'src/img.png', // 'destination': 'source'
        //            'dist/img.jpg': 'src/img.jpg',
        //            'dist/img.gif': 'src/img.gif'
        //        }
        //    },
        //    dynamic: {                         // Another target
        //        files: [{
        //            expand: true,                  // Enable dynamic expansion
        //            cwd: 'src/',                   // Src matches are relative to this path
        //            src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
        //            dest: 'dist/'                  // Destination path prefix
        //        }]
        //    }
        //},

        watch:{
            html: {
                files: ['views/*.html'],
                tasks:[  'htmlhint', 'uglify'],
                options: {livereload:true}
            },
            css: {
                files: ['public/css/*.css','build/css/*.css'],
                tasks:[  'csslint', 'uglify'],
                options: {livereload:true}
            },
            js: {
                files: ['public/js/*.js'],
                tasks:[ 'jshint', 'uglify'],
                options: {livereload:true}
            },
            less: {
                files: ['build/css/*.less'],
                options: {livereload:false},
                tasks: ['less:main']
            }
        }
    });


    // Load any grunt plugins found in package.json.
    require("load-grunt-tasks")(grunt, { scope: "devDependencies" });
    require("time-grunt")(grunt);

    // 加载包含 "concat" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-concat');
    // 加载包含 "less" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-less');
    // 加载包含 "jshint" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // 加载包含 "csslint" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-csslint');
    // 加载包含 "cssmin" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // 加载包含 "htmlhint" 任务的插件。
    grunt.loadNpmTasks('grunt-htmlhint');
    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 加载包含 "clean" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-clean');
    // 加载包含 "imagemin" 任务的插件。
    //grunt.loadNpmTasks('grunt-contrib-imagemin');
    // 加载包含 "livereload" 任务的插件。
    //grunt.loadNpmTasks('grunt-contrib-livereload');
    // 加载包含 "watch" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-watch');
    // 加载包含 "htmlmin" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.loadNpmTasks('grunt-bower-task');
    // 加载包含 "qunit" 任务的插件。
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    // 加载包含 "copy" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 默认被执行的任务列表。
    grunt.registerTask('default', [
        'clean',
        'jshint',
        'concat',
        'less',
        'csslint',
        'cssmin',
        'uglify',
        'htmlhint',
        //'imagemin',             //图片压缩
        'usemin',               //HTML处理
        'htmlmin',              //HTML压缩
        'copy',
        'watch']);
};