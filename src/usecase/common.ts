import * as express from 'express-serve-static-core'

export interface CommonInterface {
    cors: (req: express.Request, res: express.Response, next: express.NextFunction) => void
}

export const common: CommonInterface = {
    cors: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST')
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    }
}

export function isEmptyString(str: string | undefined | null): boolean {
    return str === undefined || str === null || str === ''
}

