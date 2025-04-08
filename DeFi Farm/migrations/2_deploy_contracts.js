const Tether = artifacts.require('Tether');
const RWD = artifacts.require('Rwd');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();

    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();
    
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const bank = await DecentralBank.deployed();

    // Transfer all RWD tokens to Decentral Bank
    await rwd.transfer(bank.address, '1000000000000000000000000');
    
    // Transfer 100 Tether to investor (Ganache account[1])
    await tether.transfer(accounts[1], '100000000000000000000');
};