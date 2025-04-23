import tether from '../images/tether.png'
import { useEffect, useRef, useState } from 'react';

const Main = ({ web3, tetherBalance, rwdBalance, stakingBalance, stakeTokens, unstakeTokens, releaseTokens }) => {
    const [time, setTime] = useState({});
    const [seconds, setSeconds] = useState(15);
    const timerRef = useRef(null); // useRef keeps timer persistent

    const secondsToTime = (secs) => {
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const seconds = Math.ceil((secs % 3600) % 60);
        return {
            h: hours,
            m: minutes,
            s: seconds,
        };
    };

    const countDown = () => {
        setSeconds(prev => {
          if (prev < 1) {
            clearInterval(timerRef.current);
            releaseTokens()
            setSeconds(15)
            setTime(secondsToTime(15));    
            timerRef.current = setInterval(countDown, 1000)                                
            return 0;
          }
          const next = prev - 1;
          setTime(secondsToTime(next));
          return next;
        });
    };

    useEffect(() => {
        setTime(secondsToTime(seconds));
        if (timerRef.current === null) {
          timerRef.current = setInterval(countDown, 1000);
        }
        return () => clearInterval(timerRef.current);
      }, []);

    useEffect(() => {
    setTime(secondsToTime(seconds));
    }, [seconds]);

    return (
        <div id="content" className="mt-4">
            <div className="card bg-secondary bg-opacity-75 text-light mb-4">
                <div className="card-body d-flex justify-content-center align-items-center">
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
                </div>
            </div>

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

                            <button type="button" className="btn btn-outline-light w-100 mt-2" 
                                    onClick={(event) => {
                                        event.preventDefault()
                                        const input = document.getElementById('stake-amount')
                                        let amount = input.value.toString()
                                        amount = web3.utils.toWei(amount, 'ether')
                                        console.log(`UNSTAKING ${amount}`)
                                        unstakeTokens(amount)
                                    }}
                            >
                                WITHDRAW
                            </button>
                        </div>
                    </form>


                    <div className="text-center mt-3 fw-bold">
                    <div style={{ color: 'black' }}>
                        {time.m>=10?time.m:'0'+time.m}:{time.s>=10?time.s:'0'+time.s}
                    </div>
                            </div>
                </div>
            </div>
        </div>
    );

}

export default Main;