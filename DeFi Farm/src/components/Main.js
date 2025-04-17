import tether from '../images/tether.png'
const Main = ({ web3, tetherBalance, rwdBalance, stakingBalance, stakeTokens }) => {

    return (
        <div id="content" className="mt-4">
            <table className="table table-bordered table-hover text-center text-light bg-dark">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">Staking Balance</th>
                        <th scope="col">Reward Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{web3.utils.fromWei(stakingBalance, "ether")} fUSDT</td>
                        <td>{web3.utils.fromWei(rwdBalance, "ether")} RWD</td>
                    </tr>
                </tbody>
            </table>

            <div className="card bg-secondary bg-opacity-75 text-light mb-4">
                <div className="card-body">
                    <form 
                        onSubmit={(event) => {
                            event.preventDefault()
                            const input = document.getElementById('stake-amount')
                            let amount = input.value.toString()
                            amount = web3.utils.toWei(amount, 'ether')
                            console.log(`STAKING ${amount}`)
                            stakeTokens(amount)
                        }}

                    >
                        
                        <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <label className="fw-bold">STAKE</label>
                                <span>Balance: {web3.utils.fromWei(tetherBalance, "ether")}</span>
                            </div>

                            <div className="input-group mb-3">
                                <input id="stake-amount" type="text" className="form-control" placeholder="0" required />
                                <span className="input-group-text bg-dark text-light">
                                    <img src={tether} alt="tether" height="24" className="me-2" />
                                    fUSDT
                                </span>
                            </div>

                            <button type="submit"  className="btn btn-primary w-100">
                                DEPOSIT
                            </button>

                            <button type="button" className="btn btn-outline-light w-100 mt-2" >
                                WITHDRAW
                            </button>
                        </div>
                    </form>


                    <div className="text-center text-success mt-3 fw-bold">
                        AIRDROP
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Main;