import * as http from 'http';
import {JwtDecodedInterface} from "./interface/jwtDecodedInterface";
import {QueryParametersInterface} from "./interface/query-parameters.interface";


// module augmentation
declare module 'express-serve-static-core' {

  export interface Request extends http.IncomingMessage, Express.Request {
    decoded?: JwtDecodedInterface;
    matchedParameters: {
      queryData?: QueryParametersInterface
      bodyData?: object };
  }

}
