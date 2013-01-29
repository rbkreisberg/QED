exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  paths:
    public: '_public'
  files:
    javascripts:
      defaultExtension: 'js'
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/
      order:
        before: [
          'vendor/js/console-helper.js',
          'vendor/js/jquery-1.9.0.js',
          'vendor/js/bootstrap.js',
          'vendor/js/underscore.js',
          'vendor/js/backbone.js',
          'vendor/js/backbone-mediator.js',
          'vendor/js/backbone.js',
          'vendor/js/d3.v3.js',
          'vendor/js/vq.js'
        ]
        after: [
          'vendor/js/d3.parcoords.js',
          'vendor/js/slick.core.js',
          'vendor/js/slick.grid.js',
          'vendor/js/slick.rowselectionmodel.js'
        ]
   
    stylesheets:
      defaultExtension: 'less'
      joinTo: 'css/app.css'
      order:
        after: [
          'app/css/vis.css'
        ]

    templates:
      defaultExtension: 'hbs'
      joinTo: 'js/app.js'

  server:
    path: 'server.js'
    port: 3335
    run: yes

  # minify: true
