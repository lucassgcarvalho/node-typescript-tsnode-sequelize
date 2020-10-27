import * as winston from 'winston';
import {format} from 'winston';

class WinstonConfig {

    options = {
        file: {
            level: 'error',
            filename: `logs/error/condominium.log`,
            handleExceptions: true,
            json: true,
            maxsize: 52428800, // 5MB
            maxFiles: 50,
            colorize: false
        },
        infoFile: {
            level: 'info',
            filename: `logs/info/condominium.log`,
            handleExceptions: true,
            json: true,
            maxsize: 52428800, // 5MB
            maxFiles: 50,
            colorize: false
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            json: true,
            colorize: true,
        },
    };

    private formatedPrintf = format.printf(({level, message, label, timestamp}) => {
        return `[${level}] ${timestamp} -> ${message}`;
    });

    private infoLogger: winston.Logger = winston.createLogger({
        transports: [
            new winston.transports.File(this.options.infoFile),
            new winston.transports.Console(this.options.console)
        ],
        format: format.combine(
            format.label({label: 'Info'}),
            format.timestamp(),
            this.formatedPrintf
        ),
        exitOnError: false, // do not exit on handled exceptions
    });

    private createError: winston.Logger = winston.createLogger({
        transports: [
            new winston.transports.Console(this.options.console)
        ],
        format: format.combine(
            format.timestamp(),
            winston.format.prettyPrint({colorize:true})
        ),
        exitOnError: false, // do not exit on handled exceptions
    });

    private createErrorFile: winston.Logger = winston.createLogger({
        transports: [
            new winston.transports.File(this.options.file),
        ],
        format: format.combine(
            format.timestamp(),
            winston.format.json()
        ),
        exitOnError: false, // do not exit on handled exceptions
    });


    error(error: any){
        this.createError.error(error);
        this.createErrorFile.error(error);
    }

    info(msg: any){
        this.infoLogger.info(msg);
    }

    stream(){
        return {
            write: (message: string) => {
                // use the 'info' log level so the output will be picked up by both transports (file and console)
                this.createError.error(message);
            }
        }
    }

}

export default new WinstonConfig();
