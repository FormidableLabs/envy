import { System } from '@/types';

import { getDefaultSystem, getRegisteredSystems, registerSystem } from './registration';

describe('Registration', () => {
  it('should return systems collection for `getRegisteredSystems`', () => {
    const result = getRegisteredSystems();
    expect(result).toBeInstanceOf(Array);
  });

  it('should return a the default system `getDefaultSystem`', () => {
    const result = getDefaultSystem();
    expect(result.name).toEqual('Default');
  });

  it('should add a new system to the end of the systems list when calling `registerSystem`', () => {
    const systemsBefore = getRegisteredSystems();
    const numSystemsBefore = systemsBefore.length;

    const newSystem = new (class implements System<null> {
      name = 'New system';
      isMatch() {
        return true;
      }
    })();

    registerSystem(newSystem);

    const systemsAfter = getRegisteredSystems();
    const numSystemsAfter = systemsAfter.length;

    expect(numSystemsAfter).toEqual(numSystemsBefore + 1);
    expect(systemsAfter[systemsAfter.length - 1]).toBe(newSystem);
  });
});
