import * as http from 'http';
//import cors from 'cors'
import debug from 'debug';
import App from './App';
import winston from "./config/logger/winston";
debug('ts-express:server');
const port = normalizePort(process.env.PORT || 3000);
process.env.TZ = 'America/Sao_Paulo';

//App.use(cors());
App.set('port', port);
const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch(error.code) {
    case 'EACCES':
      winston.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      winston.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr?.port}`;
  winston.info(`Listening on ${JSON.stringify(addr)}`)
  debug(`Listening on ${bind}`);
}
