import { Container } from '@/app/container';

describe('Container', function () {
	it('Should bind & resolve dependency', function () {
		const testDependencySymbol = Symbol('TestDependency');
		class TestDependency {
			name: string;

			constructor(name: string) {
				this.name = name;
			}
		}

		const container = new Container();

		container.bind<TestDependency>(testDependencySymbol, new TestDependency('test'));

		const dep = container.resolve<TestDependency>(testDependencySymbol);

		expect(dep).toBeInstanceOf(TestDependency);
		expect(dep.name).toBe('test');
	});
});
