import * as express from 'express';
import Mongoose = require('mongoose');

/**
 * RepositoryQueryCommand
 * 
 */
export class RepositoryQueryCommand {
    private static defaultLimit: number = 10;
    private static defaultSortField: string = 'name';
    public skip: number = 0;

    constructor(public query: any = {}, public sort: string = 'name', public limit: number = 10, public page: number = 1) {
        this.skip = (this.page - 1) * this.limit;
    }

    public static ParseRequest(req: express.Request): RepositoryQueryCommand {
        
        return new RepositoryQueryCommand(
            JSON.parse(req.query.q || "{ }"),
            req.query.sort || RepositoryQueryCommand.defaultSortField,
            parseInt(req.query.limit || RepositoryQueryCommand.defaultLimit),
            parseInt(req.query.page || 1));
    }

    public static ParseRequestForNameSearch(request: express.Request): RepositoryQueryCommand {
        let queryCommand = RepositoryQueryCommand.ParseRequest(request);
        queryCommand.query = { name: new RegExp(`^.*${request.query.name}.*$`, 'i') };

        return queryCommand;
    }

}

/**
 * RepositoryQueryResult
 */
export class RepositoryQueryResult {
    constructor(public found: number = 0, public page: number = 1, public viewcount: number, public view: Mongoose.Document[], public sortfields?: string) {

    }
}
