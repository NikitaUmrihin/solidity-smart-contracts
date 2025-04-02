// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

contract Tether {
    string public name = "Fake Tether";
    string public symbol = "fUSDT";
    // 1 million tokens
    uint256 totalSupply = 1_000_000_000_000_000_000_000_000;
    // (1 token = 10^18)
    uint8 decimals = 18;
}
