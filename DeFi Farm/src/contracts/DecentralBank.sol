// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

import "./Rwd.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    Rwd public rwd;

    address[] stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(Rwd _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
    }

    // Deposit fUSDT to bank
    function deposit(uint _amount) public {
        require(_amount > 0, "Amount has to be bigger than zero");

        bool ok = tether.transferFrom(msg.sender, address(this), _amount);
        require(ok, "TransferFrom failed");

        if (!isStaking[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking balance and flags
        stakingBalance[msg.sender] += _amount;
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
}