// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

// This contract is used to track migration states in a Solidity project.
contract Migrations {
    // Address of the contract owner (typically the deployer)
    address public owner;

    // Stores the last completed migration step
    uint public last_completed_migration;
    // Constructor sets the deployer as the owner of the contract
    constructor() public {
        owner = msg.sender;
    }

    // Modifier to restrict access to only the contract owner
    modifier restricted() {
        if (msg.sender == owner) _;
    }
    // Updates the last completed migration step
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    // Upgrades to a new Migrations contract by transferring the last migration step
    function upgrade(address new_address) public restricted {
        // Create an instance of the new contract
        Migrations upgraded = Migrations(new_address);
        // Transfer the migration state
        upgraded.setCompleted(last_completed_migration);
    }
}
