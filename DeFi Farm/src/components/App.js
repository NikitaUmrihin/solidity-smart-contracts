import React from 'react';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import Web3 from 'web3';

const App = () => {
    const [account, setAccount] = useState("0x0");

    useEffect(() => {
        const init = async () => {
            await loadWeb3();
            await loadBlockchainData();
        };

        init();
    }, []);


    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert("No ETH wallet detected!\n http://metamask.io/")
        }
    }

    const loadBlockchainData = async () => {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])
    }


    return (
        <div>
            <Navbar account={account}/>
        </div>
    )
}

export default App;
