export type MarkRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type ConvertType<T, K extends keyof T, NewType> = {
    [P in keyof T]: P extends K ? NewType : T[P];
};