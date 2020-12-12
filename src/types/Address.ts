import { Country } from './Country';

export type Address = {
    street: string;
    postCode: string;
    city: string;
    country: Country;
};
