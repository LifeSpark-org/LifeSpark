pragma solidity ^0.8.0;

contract Donation {
    address public owner;
    mapping(string => uint) public balances;

    constructor() {
        owner = msg.sender;
    }

    function donate(string memory region) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        balances[region] += msg.value;
    }
    
    function getBalance(string memory region) public view returns (uint) {
        return balances[region];
    }
}