import React from 'react';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';

const App = () => {

    const [account, setAccount] = useState("0x0");
    const [web3, setWeb3] = useState(null);

    // Smart contracts
    const [tether, setTether] = useState({});
    const [rwd, setRwd] = useState({});
    const [bank, setBank] = useState({});
    // Balances
    const [tetherBalance, setTetherBalance] = useState("");
    const [rwdBalance, setRwdBalance] = useState({});
    const [stakingBalance, setStakingBalance] = useState({});
    
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const init = async () => {
            try {
                const w3 = await loadWeb3()
                setWeb3(w3)
                await loadBlockchainData(w3)
            } catch (e) {
                console.error("Error initializing dApp:", e)
            } finally {
                setIsLoading(false)
            }
        };
        init();
    }, []);


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

    const loadBlockchainData = async (web3) => {
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])

        const networkId = await web3.eth.net.getId()
        console.log("Network ID: ", networkId)

        const tetherData = Tether.networks[networkId]

        // Load Tether contract
        if (tetherData) {
            const tetherInstance = new web3.eth.Contract(Tether.abi, tetherData.address)
            setTether(tetherInstance)
            const balance = await tetherInstance.methods.balanceOf(account).call()
            setTetherBalance(balance.toString())
            console.log(tetherBalance)
        } else {
            window.alert("Error! Couldn't load Tether smart contract")
        }
    }


    return (
        <div>
            <Navbar account={account}/>
            <br/><br/>
            <center>
                {isLoading? 
                    <p>Loading dApp...</p> : 
                    <p>Your fUSDT balance: {tetherBalance/10**18}</p>
                }
            </center>
        </div>
    )
}

export default App;
