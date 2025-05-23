import React from 'react';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import Rwd from '../truffle_abis/Rwd.json';
import Bank from '../truffle_abis/DecentralBank.json';
import Main from './Main'
import ParticleSettings from './ParticleSettings'

const App = () => {

    const [account, setAccount] = useState("0x0");
    const [web3, setWeb3] = useState(null);

    // Smart contracts
    const [tether, setTether] = useState({});
    const [rwd, setRwd] = useState({});
    const [bank, setBank] = useState({});
    // Balances
    const [tetherBalance, setTetherBalance] = useState("");
    const [rwdBalance, setRwdBalance] = useState("");
    const [stakingBalance, setStakingBalance] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum)
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            return web3
        } else if (window.web3) {
            return new Web3(window.web3.currentProvider)
        } else {
            window.alert("No ETH wallet detected!\n http://metamask.io/")
        }
    }

    const loadBlockchainData = async (web3, account) => {

        const networkId = await web3.eth.net.getId()
        console.log("Network ID: ", networkId)

        const tetherData = Tether.networks[networkId]
        const rwdData = Rwd.networks[networkId]
        const bankData = Bank.networks[networkId]

        // Load Tether contract
        if (tetherData) {
            const tetherInstance = new web3.eth.Contract(Tether.abi, tetherData.address)
            setTether(tetherInstance)
            const balance = await tetherInstance.methods.balanceOf(account).call()
            setTetherBalance(balance.toString())
            console.log("fUSDT: ", tetherBalance)
        } else {
            window.alert("Error! Couldn't deploy Tether smart contract")
        }

        // Load RWD contract
        if (rwdData) {
            const rwdInstance = new web3.eth.Contract(Rwd.abi, rwdData.address)
            setRwd(rwdInstance)
            const balance = await rwdInstance.methods.balanceOf(account).call()
            setRwdBalance(balance.toString())
            console.log("RWD: ", balance.toString())
        } else {
            window.alert("Error! Couldn't deploy Rwd smart contract")
        }

        // Load Decentral Bank contract
        if (bankData) {
            const bankInstance = new web3.eth.Contract(Bank.abi, bankData.address)
            setBank(bankInstance)
            const balance = await bankInstance.methods.stakingBalance(account).call({ from: account })
            setStakingBalance(balance.toString())
            console.log("Staking: ", balance.toString())
        } else {
            window.alert("Error! Couldn't deploy Decentral Bank smart contract")
        }
    }

    useEffect(() => {
        if (bank && account) {
            checkIfOwner();
        }
    }, [bank, account]);
    
    const checkIfOwner = async () => {
        if (!bank || !account) return;
    
        try {
            const contractOwner = await bank.methods.owner().call();
            console.log("Connected account:", account);
            console.log("Contract owner:", contractOwner);
    
            if (contractOwner.toLowerCase() === account.toLowerCase()) {
                console.log("✅ This account is the contract owner.");
            } else {
                console.warn("❌ This account is NOT the contract owner.");
            }
        } catch (err) {
            console.error("Error fetching contract owner:", err);
        }
    };
    

    useEffect(() => {
        
        const init = async () => {
          try {
            //  Initialize Web3
            setIsLoading(true)
            const w3 = await loadWeb3();
            setWeb3(w3);
    
            //  Get user account
            const accounts = await w3.eth.getAccounts();
            const user = accounts[0];
            setAccount(user);
    
            //  Load contracts / blockchain data
            await loadBlockchainData(w3, user);
    
          } catch (err) {
            console.error("DApp initialization failed:", err);
          } finally {
            setIsLoading(false);
          }
        };
    
        init();
      }, []);
      


    // Staking function
    const stakeTokens = (amount) => {
        setIsLoading(true)
        tether.methods.approve(bank._address, amount)
        .send({ from: account })
        .on("transactionHash", (hash) => {
            bank.methods.deposit(amount).send({from: account}).on("transactionHash", (hash) => {
                loadBlockchainData(web3, account);
                setIsLoading(false)
            })
        })
        .on('receipt', (receipt) => {
            console.log("Transaction was mined:", receipt);
        })
        .on('error', (error) => {
            console.error("Transaction failed:", error);
        })
    }

    // Unstaking function
    const unstakeTokens = (amount) => {
        setIsLoading(true)

        bank.methods.withdraw(amount).send({from: account}).on("transactionHash", (hash) =>{
            setIsLoading(false)
        }).on("transactionHash", (hash) => {
            console.log("Transaction sent with hash:", hash);
            loadBlockchainData(web3, account);
        })
    }

    const releaseTokens = async () => {

        try {
            console.log(account)
            bank.methods.issueTokens().send({ from: account })
                .on("transactionHash", (hash) => {
                    console.log("Transaction sent with hash:", hash);
                    loadBlockchainData(web3, account);
                })
                .on("receipt", (receipt) => {
                    console.log("Transaction confirmed:", receipt);
                })
                .on("error", (error) => {
                    console.error("Transaction failed:", error);
                });
    
        } catch (err) {
            console.error("Error calling issueTokens:", err);
        }
    };
    

    return (
        <div className='App' style={{position:'relative'}}>
            <div style={{position:'absolute'}}>
                <ParticleSettings/>
            </div>
            <Navbar account={account}/>
            <br/><br/>
            <center>
                {isLoading || !web3?
                    <div id="loadspinner">
                        <br/><br/><br/> 
                        <div class="spinner-border" style={{width: '3rem', height: '3rem'}} role="status">
                            <span class="sr-only"></span>
                        </div>
                    </div>
                :
                    <div>
                        <div className='container-fluid mt-5 d-flex justify-content-center'>
                            <div className='row'>
                                <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vh'}}>
                                    <div>
                                        <Main
                                        web3={web3}
                                        tetherBalance={tetherBalance} 
                                        rwdBalance={rwdBalance} 
                                        stakingBalance={stakingBalance}
                                        stakeTokens={stakeTokens}
                                        unstakeTokens={unstakeTokens}
                                        releaseTokens={releaseTokens}
                                        />
                                    </div>
                                </main>
                            </div>
                        </div>
                    </div>
                }

            </center>
        </div>
    )
}

export default App;
