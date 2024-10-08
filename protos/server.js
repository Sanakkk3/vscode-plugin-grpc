/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = __dirname + '/../protos/pb_v1.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).pbv1;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  if (!call.request.name) {
      return callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: 'Name is required'
      });
  }
  callback(null, { message: 'Hello ' + call.request.name });
}

/**
* Implements the Authenticate RPC method.
*/
function authenticate(call, callback) {
  if (call.request.username === "zsx" && call.request.password === "123") {
      callback(null, { message: 'Hello ' + call.request.username });
  } else {
      callback({
          code: grpc.status.UNAUTHENTICATED,
          details: 'Invalid username or password'
      });
  }
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Authentication.service, { authenticate });
  server.addService(hello_proto.Greeter.service, { sayHello });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();