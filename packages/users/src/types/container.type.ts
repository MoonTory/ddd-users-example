export type IContainer = IBinder & IResolver;
export interface IBinder {
	bind<T>(inter: symbol, init: T): void;
	bind<T>(inter: symbol, init: (resolver: IResolver) => T): void;
}

export interface IResolver {
	resolve<T>(clazz: symbol): T;
}

