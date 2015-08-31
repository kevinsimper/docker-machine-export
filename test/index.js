var EventEmitter = require('events').EventEmitter

var stdin = []
stdin.push('export DOCKER_TLS_VERIFY="1"\n')
stdin.push('export DOCKER_HOST="tcp://192.168.99.106:2376"\n')
stdin.push('export DOCKER_CERT_PATH="/Users/kevinsimper/.docker/machine/machines/swarm-master"\n')
stdin.push('export DOCKER_MACHINE_NAME="swarm-master"\n')
stdin.push('# Run this command to configure your shell:\n')
stdin.push('# eval "$(docker-machine env swarm-master)")\n')

process.stdin = new EventEmitter()
process.stdin.setEncoding = function () {}
process.stdin.read = function () {
  return stdin.shift()
}

require('../export')

while(stdin.length !== 0) {
  process.stdin.emit('readable')
  if(stdin.length === 0) {
    process.stdin.emit('end')
  }
}
