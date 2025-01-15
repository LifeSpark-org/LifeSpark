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

    function withdraw(string memory region) public {
        require(msg.sender == owner, "Only owner can withdraw");
        uint amount = balances[region];
        balances[region] = 0;
        payable(owner).transfer(amount);
    }
}