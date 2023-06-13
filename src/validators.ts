

const regexYYYYMMDD = new RegExp(/^\d{8}$/);

type ValidateFn = (value: string) => boolean

export const validators: {[name:string]: ValidateFn } = {
    isYYYYMMDD: (value) => {
        return regexYYYYMMDD.test(value);
    }
}