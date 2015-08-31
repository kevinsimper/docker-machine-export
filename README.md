# docker-machine-export
This script is used to output your Docker Machine environment variables, including your certificates. This will be useful if you want to control your Docker Machine from another computer.

An example of use is as follows:

`docker-machine env swarm-example | docker-machine-export`

In this example:

`{"DOCKER_TLS_VERIFY":"1","DOCKER_HOST":"tcp://192.168.99.1:2376","DOCKER_CERT_PATH":"(path)/swarm-example","DOCKER_MACHINE_NAME":"swarm-example","ca.pem":"(base64 encoded ca.pem)","cert.pem":"(base64 encoded cert.pem)","id_rsa":"(base64 encoded id_rsa)","id_rsa.pub":"(base64 encoded id_rsa.pub)","key.pem":"(base64 encoded key.pem)","server-key.pem":"(base64 encoded server-key.pem)","server.pem":"(base64 encoded server.pem)"}`