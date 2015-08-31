var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('unexpected')
var os = require('os')
var EventEmitter = require('events').EventEmitter
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))

lab.test('verify env variables read', function (done) {
  // Generate certificate-related files to be base64 encoded and
  // output with export script
  var tmp = os.tmpdir()
  var filesToExport = ['ca.pem', 'cert.pem', 'id_rsa', 'id_rsa.pub', 'key.pem', 'server-key.pem', 'server.pem']
  var testFiles = Promise.all(filesToExport.map(function(filename) {
    return fs.writeFileAsync(tmp+"/"+filename, "test")
  }))

  testFiles.then(function(res) {
    var stdin = []
    stdin.push("export DOCKER_TLS_VERIFY=\"1\""+os.EOL)
    stdin.push("export DOCKER_HOST=\"tcp://192.168.0.0.1:2376\""+os.EOL)
    stdin.push("export DOCKER_CERT_PATH=\""+tmp+"\""+os.EOL)
    stdin.push("export DOCKER_MACHINE_NAME=\"swarm-test\""+os.EOL)
    stdin.push("# Run this command to configure your shell:"+os.EOL)
    stdin.push("# eval \"$(dm env swarm-test)\""+os.EOL)

    process.stdin = new EventEmitter()
    process.stdin.setEncoding = function () {}
    process.stdin.read = function () {
      return stdin.shift()
    }

    // Run actua export script
    require('../export')

    while (stdin.length !== 0) {
      process.stdin.emit('readable')
      if (stdin.length === 0) {
        process.stdin.emit('end')

        // Here we should catch stdout
        //{"DOCKER_TLS_VERIFY":"1","DOCKER_HOST":"tcp://192.168.0.0.1:2376","DOCKER_CERT_PATH":"/tmp","DOCKER_MACHINE_NAME":"swarm-test","ca.pem":"dGVzdA==","cert.pem":"dGVzdA==","id_rsa":"dGVzdA==","id_rsa.pub":"dGVzdA==","key.pem":"dGVzdA==","server-key.pem":"dGVzdA==","server.pem":"dGVzdA=="}
        done()
      }
    }
  }).catch(function (err) {
      // Show error from creating test files
    expect(1, 'to equal', 0, err)
      done()
  })
})