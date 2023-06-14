

const regexYYYYMMDD = new RegExp(/^\d{8}$/);

type ValidateFn = (value: string) => boolean | string

/**
 * Validators available to be executed against query arguments
 */
export const validators: {[name:string]: ValidateFn } = {
    isYYYYMMDD: (value) => 
        regexYYYYMMDD.test(value) ? true : 'Inform a valid yyyymmdd value'
    
}