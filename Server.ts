'use strict';

import * as express from 'express';
import * as bodyparser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';

import{ ApplicationConfig } from './Config/ApplicationConfig';
import * as mongoose from 'mongoose';
import { IRoute } from './Route/IRoute';

/**
 * Server
 */
export class Server {
    private app: express.Application;
    private routes:IRoute[] = [];

    public port: number = process.env.PORT || 3000;    

    public static Bootstrap(config:ApplicationConfig = new ApplicationConfig()): Server {
        return new Server(config);
    }

    public GetServerInstance(): express.Application {
        return this.app;
    }

    public Start(port?: number) {

        if (port)
            this.port = port;        
        
        console.log(`Configuring ${this.routes.length} routes.`);
        // defines the api routes

        this.defineRoutes();
        this.app.listen(this.port);                
    }

    public AddRoute(route:IRoute){        
        // TODO: check if express is already listening
        console.log(`Pushing route ${route.path}`);
        this.routes.push(route);
    }

    constructor(public config:ApplicationConfig) {
        this.app = express();
        this.configure();
        this.errorhandlers();

        this.app.get('/', function(req: express.Request, res: express.Response) {
            res.send('Wellcome to Express service (with Typescript)');
        })

    }    

    private configure() {
        this.app.locals.ApplicationConfig = this.config;
        this.app.use(cors());
        this.app.use(bodyparser.urlencoded({ extended: false }));
        this.app.use(bodyparser.json());
        this.app.use(morgan('dev'));
       
    }

    private defineRoutes() {

        this.routes.forEach(route => {
            console.log(`Adding route ${route.path}`);
            route.setup(this);
        });
        
    }
    
    private errorhandlers(){
        // error handlers

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.json({
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        this.app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: {}
            });
        });

    }

}