const Tether = artifacts.require('Tether');
const RWD = artifacts.require('Rwd');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer) {
    await deployer.deploy(Tether);
    await deployer.deploy(RWD);
    await deployer.deploy(DecentralBank);
};