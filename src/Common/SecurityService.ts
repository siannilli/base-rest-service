import * as jwt from 'jsonwebtoken';
import * as Express from 'express';
import { ApplicationConfig, jwtConfig } from '../Config/ApplicationConfig';
import * as Errors from './Exceptions';
import * as uuid from 'node-uuid';

export interface IAuthenticatedRequest extends Express.Request{
    token:TokenPayload;
    is_authenticated : boolean;
}

/**
* Token
*/
export class TokenManagement {
    private jwtConfig:jwtConfig = null;

    constructor(private config:ApplicationConfig){
        this.jwtConfig = config.GetJWTConfig();
        console.log(`TokenManagement service setup with secret ${this.jwtConfig}`);
    }
    
    public static SecurityCheck(request: IAuthenticatedRequest, response: Express.Response, next: Express.NextFunction) {        
        let token: string = request.header('Authorization') || request.query.auth_token || request.params.auth_token;               

        if (token === undefined)
            Errors.SendError(new Errors.NotAuthenticatedError(), response);
        else {

            console.log('found security token decoded');

            try {
                console.log('Getting configuration from request.app.locals.ApplicationConfig.');
                let jwtConfig:jwtConfig = request.app.locals.ApplicationConfig.GetJWTConfig();
                let decoded = jwt.verify(token, jwtConfig.secret);

                if (decoded === undefined)
                    Errors.SendError(new Errors.NotAuthenticatedError(), response);
                else {

                    let decoded_token:TokenPayload = TokenPayload.parse(decoded);

                    console.log(`Token ${JSON.stringify(decoded_token)}`);
                    
                    console.log(`Token issued  : ${decoded_token.issued}`);
                    console.log(`Token expires : ${decoded_token.expires}`);
                    console.log(`Token do not user before : ${decoded_token.dontuserbefore}`);

                    request.is_authenticated = true;
                    request.token = decoded_token;
                    next();
                }
            }
            catch (error) {
                Errors.SendError(new Errors.NotAuthenticatedError(`Invalid security token (${error})`), response);
            }
        }
    }

    public SignPayload(payload: TokenPayload): string {

        return (jwt.sign(payload, this.jwtConfig.secret,
            {
                jwtid: uuid.v4(), 
                expiresIn: this.jwtConfig.expiration,
                algorithm: this.jwtConfig.algorithm
            })
        );
    }

}

export interface IJWTStandardClaims {
    iss:string;
    sub:string;
    aud:string;
    exp:number;
    nbf:number;
    iat:number;
    jti:string;    
}
/**
 * TokenPayload
 */
export class TokenPayload implements IJWTStandardClaims {    
    
    constructor(public login: string, public type: string, public applications: string[], public roles: string[]) {
        if (!(login && type))
            throw new Errors.GeneralError('Invalid token data');                           
    }

    CanRun(application: string): boolean {        
        let result:boolean = this.applications.indexOf(application) > -1;
        console.log(`${this.login} ${result ? 'can': 'can not'} run application ${application}`);
        return result;
    }

    IsInRole(role: string): boolean {
        let result:boolean = this.roles.indexOf(role) > -1;        
        console.log(`${this.login} ${(result ? 'is' : 'is not')} in role ${role}`);
        return result;
    }
    
    /* ITokenPayload implements */
    iss:string;
    sub:string;
    aud:string;
    exp:number;
    nbf:number;
    iat:number;
    jti:string;  

    get expires():Date{        
        return this.convertToDate(this.exp);
    }
    
    get issued():Date{
        return this.convertToDate(this.iat);
    }
    
    get dontuserbefore():Date{
        return this.convertToDate(this.nbf);
    }
    
    private convertToDate(num:number):Date{
        let dt:Date;
        if (num) dt = new Date(num * 1000);
        
        return dt;
    }
    
    public static parse(decoded_token:any){
        let instance:TokenPayload = new TokenPayload(decoded_token.login, decoded_token.type, decoded_token.applications || [], decoded_token.roles || []);
        instance.iss = decoded_token.iss;
        instance.iat = decoded_token.iat;
        instance.exp = decoded_token.exp;
        instance.aud = decoded_token.aud;
        instance.jti = decoded_token.jti;
        instance.nbf = decoded_token.nbf;
        instance.sub = decoded_token.sub;
        
        return instance;        
    }

}