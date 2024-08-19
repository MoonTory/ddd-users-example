import { IContainer } from '@/types/container.type';

export class Container implements IContainer {
  private registry = new Map();

  public bind<T>(inter: symbol, init: T | ((resolver: IContainer) => T)): void {
    if (typeof init === 'function') {
      this.registry.set(inter, init);
    }

    this.registry.set(inter, init);
  }

  public resolve<T>(clazz: symbol): T {
    const resolver = this.registry.get(clazz);

    if (typeof resolver === 'function') return resolver(this);

    return resolver;
  }
}
