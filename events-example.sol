pragma solidity >=0.7.0 <0.9.0;

contract LearnEvents {
    // Events are a way for smart contracts to communicate changes to external applications
    // (like a web interface, blockchain explorer, or wallet).

    // Events are not necessary for a blockchain transaction to take place - They are only used for logging information!

    // Indexed parameters help external consumers filter logs easily.
    // However, Ethereum allows only up to three indexed parameters per event to reduce storage costs.

    // Declaring an event (CamelCase is a good naming convention)
    event NewTrade(
        uint indexed date, // The timestamp of when the trade happened (indexed for filtering)
        address indexed from, // The sender's address (indexed for filtering)
        address to, // The receiver's address (not indexed, but still stored in logs)
        uint indexed amount // The amount transferred (indexed for filtering)
    );

    // Function to execute a trade and log the event
    function trade(address to, uint amount) external {
        // 'emit' keyword in Solidity is used to trigger events.
        emit NewTrade(block.timestamp, msg.sender, to, amount);
        // When an event is emitted, its details get logged on the blockchain.
        // External applications can listen for these events to track transactions, approvals, or other state changes.
    }
}
