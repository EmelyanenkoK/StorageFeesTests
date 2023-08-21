import { toNano } from 'ton-core';
import { Thrower } from '../wrappers/Thrower';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const thrower = provider.open(Thrower.createFromConfig({}, await compile('Thrower')));

    await thrower.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(thrower.address);

    // run methods on `thrower`
}
