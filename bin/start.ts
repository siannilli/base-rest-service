import { Server } from '../Server';

let expressServer:Server = Server.Bootstrap();
expressServer.Start();

console.log(`Express server started listening on port ${expressServer.port}`);