const Tether = artifacts.require('Tether');
const Rwd = artifacts.require('Rwd');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()


// Option 2:
// contract('DecntrBank', [owner, customer]) => { ...
contract('DecentralBank', accounts =>  {

    let tether, rwd, bank

    // Conversion function
    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    // First of all - load smart contracts
    before(async () => {
        tether = await Tether.new()
        rwd = await Rwd.new()
        bank = await DecentralBank.new(rwd.address, tether.address)

        // Transfer all RWD tokens to bank   
        await rwd.transfer(bank.address, tokens('1000000'));

        // Send 100 fUSDT to customer
        await tether.transfer(accounts[1], tokens('100'), {from: accounts[0]});

    })
    
    // Start testing

    describe('Fake Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, "Fake Tether")
        })

        it('matches symbol successfully', async () => {
            const symbol = await tether.symbol()
            assert.equal(symbol, "fUSDT")
        })
    })


    describe('Rewardz Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, "Rewardz Token")
        })

        it('matches symbol successfully', async () => {
            const name = await rwd.symbol()
            assert.equal(name, "RWD")
        })
    })
    
    
    
    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await bank.name()
            assert.equal(name, "Decentral Bank")
        })

        it('money in the bank', async () => {
            const balance = await rwd.balanceOf(bank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    
})
