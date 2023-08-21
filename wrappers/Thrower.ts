import { Address, toNano, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Message, storeMessage } from 'ton-core';



export class Thrower implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Thrower(address);
    }

    static createFromConfig(code: Cell, workchain = 0) {
        const data = beginCell().endCell();
        const init = { code, data };
        return new Thrower(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value:bigint = toNano('10')) {
        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                     .storeUint(0, 32) // op = top up
                     .storeUint(0, 64) // query id
                  .endCell(),
        });
    }

    async sendNonbouncable(provider: ContractProvider, via: Sender, value:bigint = toNano('10')) {
        await provider.internal(via, {
            value: value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            bounce: false,
            body: beginCell()
                     .storeUint(0, 32) // op = top up
                     .storeUint(0, 64) // query id
                  .endCell(),
        });
    }

}
