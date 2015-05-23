module.exports = function(grunt) {
  var banner = '/*! <%= pkg.name %> v<%= pkg.version %> <%= pkg.licenses[0].url %> */\n';
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: banner,
        separator: ';\n'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/iso_boxer.js'
      }
    },
    uglify: {
      options: {
        banner: banner
      },
      dist: {
        files: {
          'dist/iso_boxer.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    watch: {
      files: '<%= concat.dist.src %>',
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'uglify']);

};