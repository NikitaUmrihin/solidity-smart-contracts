// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

contract Rwd {
    string public name = "Rewardz Token";
    string public symbol = "RWD";
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
    mapping(address => mapping(address => uint256)) public allowance;

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
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool ok) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[msg.sender][_from] >= _value, "Allowance exceeded");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
