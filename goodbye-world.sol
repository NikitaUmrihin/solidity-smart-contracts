// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract Will {
    address owner;
    uint    fortune;
    bool    deceased;

    constructor() payable {
        owner    = msg.sender;
        fortune  = msg.value;
        deceased = false;
    }

    //  ___Modifiers___
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier mustBeDeceased {
        require(deceased == true);
        _;
    }
    //  ______________

    //  Array of family wallets
    address payable[] familyWallets;

    //  Map inheritance
    mapping(address => uint) inheritance;

    //  Set inheritance for each address
    function setInheritance(address payable wallet, uint amount) public onlyOwner{
        familyWallets.push(wallet);
        inheritance[wallet] = amount;
    }

    //  Pay each family member
    function payout() private mustBeDeceased {
        for (uint i=0; i<familyWallets.length; i++) {
            familyWallets[i].transfer(inheritance[familyWallets[i]]);
        }
    }

    //  Dead's man switch - triggers the will smart contract
    //  ( oracle switch simulation )
    function die() public onlyOwner {
        deceased = true;
        payout();
    }

}
