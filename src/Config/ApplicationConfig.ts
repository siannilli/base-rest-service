/**
 */
const DEFAULTS = {
    "HASH_ALGORITHM": "HS256",
    "DATASTORE": "mongodb://dbo:dbo@localhost:27017/database",
    "SECURE_API": true,
    "JWT_SECRET": "AuthT0k3nP@ssw0rd"
};

export class jwtConfig{
    public algorithm:string = process.env.HASH_ALGORITHM || DEFAULTS.HASH_ALGORITHM;
    
    constructor(public secret:string, public expiration:string = '1d'){
        
    }    
}

export class ApplicationConfig   {    
    private _db:string = process.env.DATASTORE || DEFAULTS.DATASTORE;
    private _jwt:jwtConfig = new jwtConfig(process.env.JWT_SECRET || DEFAULTS.JWT_SECRET);
    private _secureResourceApi:boolean = JSON.parse(process.env.SECURE_API || DEFAULTS.SECURE_API);    
    
    public GetJWTConfig() : jwtConfig {        
        return this._jwt;
    }   
    public GetDatabaseConnectionString() : string {
        return this._db;
    }       
    public MustAuthenticateRequest():boolean{        
        return this._secureResourceApi;
    }
}