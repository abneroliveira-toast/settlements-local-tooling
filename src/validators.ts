

const regexYYYYMMDD = new RegExp(/^\d{8}$/);

type ValidateFn = (value: string) => boolean | string

export const validators: {[name:string]: ValidateFn } = {
    isYYYYMMDD: (value) => 
        regexYYYYMMDD.test(value) ? true : 'Inform a valid yyyymmdd value'
    
}