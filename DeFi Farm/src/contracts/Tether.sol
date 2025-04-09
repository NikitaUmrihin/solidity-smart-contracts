// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

contract Tether {
    string public name = "Fake Tether";
    string public symbol = "fUSDT";
    // 1 million tokens
    uint256 totalSupply = 1_000_000_000_000_000_000_000_000;
    // (1 token = 10^18)
    uint8 decimals = 18;

    // Events to notify clients about changes in the contract state
    event Transfer(address indexed _from, address indexed _to, uint _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value,
        string message
    );

    // Mapping of account balances
    mapping(address => uint256) public balanceOf;

    // The allowance mapping is part of the ERC-20 token standard.
    // It allows an account (_owner) to give permission to another account (_spender) to spend a certain amount of tokens on its behalf.
    // The first address represents the owner of the tokens.
    // The second address represents the spender.
    mapping(address => mapping(address => uint256)) public allowance;

    // Constructor assigns the total token supply to the contract deployer's address.
    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    // Function to transfer tokens from the sender to another address
    function transfer(address _to, uint256 _value) public returns (bool ok) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Function to approve another address to spend tokens on behalf of the sender
    // ( creates the allowance mapping)
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool ok) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value, "Tx approved");
        return true;
    }

    // Function to allow a spender to transfer tokens from another address within the allowed limit
    // ( Third party transfers )
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool ok) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
