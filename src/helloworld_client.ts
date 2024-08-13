import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { error } from 'console';
import { cli } from 'webpack';

const PROTO_PATH = __dirname + '/../protos/helloworld.proto';
const SERVER_ADDRESS = '192.168.0.11:50051';
// const SERVER_ADDRESS = 'localhost:50051';

interface GreeterService {
  SayHello(
    request: { name: string },
    callback: (error: grpc.ServiceError | null, response: { message: string }) => void
  ): void;

  SayHelloStreamReply(
    request: { name: string }
  ): grpc.ClientReadableStream<{ message: string }>;

  SayHelloBidiStream(
    call: grpc.ServerDuplexStream<{ name: string }, { message: string }>
  ): void;
}

interface AuthenticationService {
  Authenticate(
    request: { username: string, password: string },
    callback: (error: grpc.ServiceError | null, response: { success: boolean, message: string }) => void
  ): void;
}


// 动态加载 .proto文件
function loadProto() {
  const pakageDefinition = protoLoader.loadSync(
    PROTO_PATH,   // 定义的 .proto 服务
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
  const protoDescriptor = grpc.loadPackageDefinition(pakageDefinition) as any;
  return protoDescriptor.helloworld;
}

function createClient<T>(service: string): T {
  const proto = loadProto();
  const client = new proto[service](SERVER_ADDRESS, grpc.credentials.createInsecure()) as T;
  return client;
}

export function SayHello(name: string) {

  console.log("run SayHello().");

  const client = createClient<GreeterService>('Greeter');
  const request = { name };

  client.SayHello(request, (error, response) => {
    console.log("call for Greeter.SayHello service.");
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Greeting:', response?.message);
    }
  });
}

export function SayHelloStreamReply(name: string) {

  console.log("call for Greeter.SayHelloStreamReply service.");

  const client = createClient<GreeterService>('Greeter');
  const request = { name };

  const call = client.SayHelloStreamReply(request);

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

export function Authenticate(username: string, password: string) {

  console.log("run Authenticate().");

  const client = createClient<AuthenticationService>('Authentication');
  const request = { username, password };

  client.Authenticate(request, (error, response) => {
    console.log("call for Authentication.Authenticate service.");
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Authentication success:', response?.message);
    }
  });
}