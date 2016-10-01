import * as express from 'express';
import Mongoose = require('mongoose');

/**
 * RepositoryQuery
 * 
 */
export class ResourceQuery
 {
    constructor(request:express.Request, private defaultSort:string, private defaultLimit:number = 10) {
        this.parseQuery(request);
    }
    limit:number; skip:number; sort:string; 
    query:any;
    
    handleErrorResponde(err: any, res: express.Response):void {
        res.json(500, err);
    };
    
    private parseQuery(req: express.Request){                               
        this.limit = parseInt(req.query.limit || this.defaultLimit);
        this.skip = (parseInt(req.query.page) -1) * this.limit || 0;
        this.sort = req.query.sort || this.defaultSort;
        
        this.query = JSON.parse( req.query.q || "{ }");
                
    }    
}

/**
 * RepositoryQueryResult
 */
export class ResourceQueryResult {
    constructor(public resultset:Mongoose.Document[], public count:number = 0, public page:number = 1) {
        
    }
}
