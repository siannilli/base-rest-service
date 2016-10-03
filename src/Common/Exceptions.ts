import * as Express from 'express';

/**
 * Error exceptions
 */
export interface ApiError extends Error{
    status:number;
}

export abstract class BaseApiError implements ApiError{
    public status:number = 500;
    public name:string = 'BaseApiError';
    public message:string = 'Unexpected exception';
    
    constructor(message?:string, status?:number, name?:string){
        if (status) this.status  = status;
        if (name) this.name = name;
        if (message) this.message = message;
    }
}

export class GeneralError extends BaseApiError{          
    constructor(public message:string, public name:string  = 'GenericError' ){
        super(message || 'General exception', 500, name)
    }
       
}

export class DatabaseError extends GeneralError{    
    constructor(public innerError:any){
        super(innerError.errmsg || 'Undefined database error', 'RepositoryError');
    }
}

export class MalformedEntityError extends BaseApiError{
    constructor(message?:string){
        super(message || 'Entity request was malformed', 422, 'MalformedEntityError');
    }
}

export class EntitytNotFoundError extends BaseApiError{
    constructor(message?:string){
        super(message || 'Not found', 404, 'EntitytNotFoundError');
    }
    
}

export class NotImplementedError extends BaseApiError{
    constructor(public message?:string ){
        super (message || 'Not implemented', 501, 'NotImplementedError');
    }

}

export class NotAuthenticatedError extends BaseApiError{
    constructor(message?:string){
        super( message || 'Not authenticated', 403, 'NotAuthenticatedError');
    }
}

export class NotAuthorizedError extends BaseApiError{
    constructor(message?:string){
        super( message || 'Not authorized', 401, 'NotAuthorizedError');
        
    }
}

 /**
 * InvalidCredentialErrors
 */
export class InvalidCredentialErrors extends BaseApiError {
    constructor(message?:string) {
        super(message || 'Either username or password are not valid', 401, 'InvalidCredentialErrors');
    }
}

export let SendError = function (error:any, response:Express.Response ) {
    response.status(error.status || 500).send(error.message || error);
}