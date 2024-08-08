import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { cli } from 'webpack';

const PROTO_PATH = __dirname + '/../protos/pb_v1.proto';
const SERVER_ADDRESS = 'localhost:50051';

// 动态加载 .proto文件
function loadProto() {
    console.log("PROTO_PATH: ",PROTO_PATH);
    const pakageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    });
    const protoDescriptor = grpc.loadPackageDefinition(pakageDefinition) as any;
    console.log("loadProto success!");
    return protoDescriptor.pbv1;
}

function createGreeterClient(){
    const proto = loadProto();
    const client = new proto.Greeter(SERVER_ADDRESS, grpc.credentials.createInsecure());
    return client;
}

export function sayHello(name: string){
    const client = createGreeterClient();
    const request = {name: name};

    client.sayHello(request, (error:any, response:any) => {
        if(error){
            console.error('Error:', error);
            return;
        }
        console.log('Greeting:',response.message);
    });
}

// Function to call SayHelloStreamReply RPC
export function sayHelloStreamReply(name:string) {
    const client = createGreeterClient();
    const request = { name: name };
  
    const call = client.sayHelloStreamReply(request);
  
    call.on('data', (response:any) => {
      console.log('Streaming Reply:', response.message);
    });
  
    call.on('end', () => {
      console.log('Streaming ended');
    });
  
    call.on('error', (error:any) => {
      console.error('Error:', error);
    });
  }

// Example usage
// sayHello('Alice');
// sayHelloStreamReply('Bob');