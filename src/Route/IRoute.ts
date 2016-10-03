import { Server } from '../Server';

export interface IRoute{
    path:string;    
    setup(expressApp: Server);
}