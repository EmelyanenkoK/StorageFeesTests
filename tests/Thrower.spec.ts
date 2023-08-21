import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Address, Cell, toNano, Dictionary, beginCell } from 'ton-core';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

import { Thrower } from '../wrappers/Thrower';

const loadConfig = (config:Cell) => {
          return config.beginParse().loadDictDirect(Dictionary.Keys.Int(32), Dictionary.Values.Cell());
        };

describe('Thrower', () => {
    let code: Cell;
    let blockchain: Blockchain;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        code = await compile('Thrower');
        blockchain.now = 1;
    });

    it('should deploy', async () => {
        let thrower = blockchain.openContract(Thrower.createFromConfig(code));
        let deployer = await blockchain.treasury('deployer', {balance: toNano("1000000000")});
        let result = await thrower.sendDeploy(deployer.getSender(), toNano('1'));
        // it will be aborted, but it is ok
        expect(result.transactions).toHaveTransaction({
                to: thrower.address,
                deploy: true,
        });
        let smc = await blockchain.getContract(thrower.address);
        expect(smc.balance).toBe(0n);
        blockchain.now = 365*3600*24;
        const initialState = blockchain.snapshot();
        result = await thrower.sendDeploy(deployer.getSender(), toNano('49.99'));
        expect(result.transactions).toHaveTransaction({
                to: thrower.address,
                aborted: true,
        });
        result = await thrower.sendDeploy(deployer.getSender(), toNano('50'));
        expect(result.transactions).toHaveTransaction({
                to: thrower.address,
                aborted: false,
        });

        // return back
        await blockchain.loadFrom(initialState);
        result = await thrower.sendNonbouncable(deployer.getSender(), toNano('50.001'));
        expect(result.transactions).toHaveTransaction({
                to: thrower.address,
                aborted: true,
        });
        await blockchain.loadFrom(initialState);
        result = await thrower.sendNonbouncable(deployer.getSender(), toNano('50.05'));
        expect(result.transactions).toHaveTransaction({
                to: thrower.address,
                aborted: false,
        });
    });

});
