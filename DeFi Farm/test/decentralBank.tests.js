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

    //  Test Fake Tether Token Deployment
    describe('Fake Tether Deployment', async () => {
        it('matches name and symbol successfully', async () => {
            const name = await tether.name()
            const symbol = await tether.symbol()
            assert.equal(name, "Fake Tether")
            assert.equal(symbol, "fUSDT")
        })
    })

    //  Test Rewardz Token Deployment
    describe('Rewardz Token Deployment', async () => {
        it('matches name and symbol successfully', async () => {
            const name = await rwd.name()
            const symbol = await rwd.symbol()
            assert.equal(name, "Rewardz Token")
            assert.equal(symbol, "RWD")
        })
    })
     
    // Test Decentral Bank Deployment
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

    // Test Yield Farming
    describe('Yield Farming', async () => {
        // Test customer fUSDT balance before deposit
        it('customer balance before staking', async () => {
            let balance = await tether.balanceOf(accounts[1])
            assert.equal(balance.toString(), tokens('100'), 'customer wallet before staking')
        })

        // Test allowance approval
        it('set allowance', async () => {
            await tether.approve(bank.address, tokens('50'), {from: accounts[1]})
            allowance = await tether.allowance(accounts[1], bank.address)
            assert.equal(allowance.toString(), tokens('50'), 'approve allowance')
        })

        // Test customer fUSDT balance after deposit
        it('deposit customer funds (stake)', async () => {
            await bank.deposit(tokens('50'), {from: accounts[1]})
            balance = await tether.balanceOf(accounts[1])
            assert.equal(balance.toString(), tokens('50'), 'customer balance after staking')
        })

        // Test customer staking status
        it('check staking status', async () => {
            staking = await bank.isStaking(accounts[1])
            assert.equal(staking.toString(), 'true', 'customer staking status')
        })
        
        // Issue tokens
        it('issue reward tokens', async () => {
            
            // Make sure only owner can issue tokens
            await bank.issueTokens({from: accounts[1]}).should.be.rejected
            
            await bank.issueTokens({from: accounts[0]})
            balance = await rwd.balanceOf(accounts[1])
            assert.equal(balance.toString(), tokens('5'), 'customer receiving reward tokens')
        })

        // Test customer fUSDT balance after withdrawal
        it('withdraw customer funds (unstake)', async () => {
            await bank.withdraw(tokens('50'), {from: accounts[1]})
            balance = await tether.balanceOf(accounts[1])
            assert.equal(balance.toString(), tokens('100'), 'customer personal balance after unstaking')

            balance = await bank.stakingBalance(accounts[1])
            assert.equal(balance.toString(), tokens('0'), 'bank balance after unstaking')

            balance = await tether.balanceOf(bank.address)
            assert.equal(balance.toString(), tokens('0'), 'customer staking balance after unstaking')
            
        })

        // Test customer staking status
        it('check staking status', async () => {
            staking = await bank.isStaking(accounts[1])
            assert.equal(staking.toString(), 'false', 'customer staking status')
        })

    })    
})