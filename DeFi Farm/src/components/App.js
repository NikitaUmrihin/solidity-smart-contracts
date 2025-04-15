import React from 'react';
import Navbar from './Navbar';
import { useState } from 'react';

const App = () => {

    const [account, setAccount] = useState("0x0");

    return (
        <div>
            <Navbar account={account}/>
        </div>
    )
}

export default App;
