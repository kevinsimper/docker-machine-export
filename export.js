#! /usr/bin/env node

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var os = require('os')

process.stdin.setEncoding('utf8');

var filesToExport = ['ca.pem', 'cert.pem', 'id_rsa', 'id_rsa.pub', 'key.pem', 'server-key.pem', 'server.pem']

var env = ''
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    env += chunk
  }
})

process.stdin.on('end', function() {
  var config = {}
  var path = null
// os end of line
  env.split(os.EOL).forEach(function (line) {
    // Ignore comment lines
    if (line && line[0] !== '#') {
      if (line.substr(0, 7) === 'export ') {
        var definition = line.substr(7)
        var name = definition.split('=')[0]

        config[name] = definition.substr(name.length+1)
        config[name] = config[name].substr(1, config[name].length-2)

        if (line.substr(0, 24) === 'export DOCKER_CERT_PATH=') {
          path = line.substr(24)
          path = path.substr(1, path.length-2)
        }
      }
    }
  })

  var readPromises = []
  var files = Promise.all(filesToExport.map(function(filename) {
    return fs.readFileAsync(path + '/' + filename, 'utf8').then(function (data) {
      // Base64 encode data certificate
      return {filename: filename, result: new Buffer(data).toString('base64')}
    })
  }))

  files.then(function (responses) {
    responses.forEach(function(response) {
      config[response.filename] = response.result
    })

    return config
  }).then(function(config) {
    console.log(JSON.stringify(config))
  }).catch(function (err) {
    console.error(err)
  })
})
