// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

import "./Rwd.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    Rwd public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(Rwd _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
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

    // Withdraw fUSDT from bank
    function withdraw(uint _amount) public {
        require(_amount > 0, "Amount has to be bigger than zero");
        require(isStaking[msg.sender] == true, "User is not staking");

        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "User is not staking");

        require(balance >= _amount, "Amount is greater than balance");

        bool ok = tether.transfer(msg.sender, _amount);
        require(ok, "Transfer failed");

        // Update staking balance and flags
        stakingBalance[msg.sender] -= _amount;
        if (stakingBalance[msg.sender] == 0) {
            isStaking[msg.sender] = false;
        }
    }

    function issueTokens() public {
        // Only owner can issue tokens
        require(msg.sender == owner, "caller must be owner");

        // Transfer tokens to stakers
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 10;
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }
}
