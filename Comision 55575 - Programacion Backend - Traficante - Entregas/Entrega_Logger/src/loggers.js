import winston from 'winston';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'magenta',
        info: 'white',
        http: 'cyan',
        debug: 'green'
    }

};

const ENVIRONMENT = 'production';
let logger;

if (ENVIRONMENT == 'production') {
    //prodLogger 
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({
                        all: true,
                        colors: customLevelOptions.colors,
                    }),
                    winston.format.simple(),
                )
            }),
            new winston.transports.File({
                filename: 'logs/errors.log',
                level: 'error',
            })
        ],
    })
} else if (ENVIRONMENT == 'develop') {
    //devLogger
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({
                        all: true,
                        colors: customLevelOptions.colors,
                    }),
                    winston.format.simple(),
                )
            })
        ],
    })
};

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    next();
};