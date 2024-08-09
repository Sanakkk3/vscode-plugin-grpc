import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { error } from 'console';
import { cli } from 'webpack';

const PROTO_PATH = __dirname + '/../protos/pb_v1.proto';
// const SERVER_ADDRESS = '192.168.0.11:50051';
const SERVER_ADDRESS = 'localhost:50051';

interface GreeterService {
  sayHello(request: { name: string }, callback: (error: grpc.ServiceError | null, response: { message: string }) => void): void;
  sayHelloStreamReply(request: { name: string }): grpc.ClientReadableStream<{ message: string }>;
}

interface AuthenticationService {
  authenticate(request: { username: string, password: string }, callback: (error: grpc.ServiceError | null, response: { success: boolean, message: string }) => void): void;
}


// 动态加载 .proto文件
function loadProto() {
  console.log("PROTO_PATH: ", PROTO_PATH);
  const pakageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
  const protoDescriptor = grpc.loadPackageDefinition(pakageDefinition) as any;
  console.log("loadProto success!");
  return protoDescriptor.pbv1;
}

function createClient<T>(service: string): T {
  const proto = loadProto();
  const client = new proto[service](SERVER_ADDRESS, grpc.credentials.createInsecure()) as T;
  return client;
}

export function sayHello(name: string) {
  const client = createClient<GreeterService>('Greeter');
  const request = { name };

  client.sayHello(request, (error, response) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Greeting:', response?.message);
    }
  });
}

export function sayHelloStreamReply(name: string) {
  const client = createClient<GreeterService>('Greeter');
  const request = { name };

  const call = client.sayHelloStreamReply(request);

  call.on('data', (response) => {
    console.log('Streaming Reply:', response.message);
  });

  call.on('end', () => {
    console.log('Streaming ended');
  });

  call.on('error', (error) => {
    console.error('Error:', error);
  });
}

export function authenticate(username: string, password: string) {
  const client = createClient<AuthenticationService>('Authentication');
  const request = { username, password };

  client.authenticate(request, (error, response) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Authentication success:', response?.message);
    }
  });
}