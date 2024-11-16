// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenWallet {
    address payable public owner;
    uint256 public balance;

    event Mint(address indexed to, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event ResetBalance();

    mapping(address => uint256) private balances;
    address[] private users;

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        balances[owner] = initBalance;
        users.push(owner);
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function mintTokens(uint256 amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        balances[owner] += amount;
        balance += amount; // Update the contract balance
        emit Mint(owner, amount);
    }

    function transferTokens(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        if (balances[to] == 0) {
            users.push(to);
        }
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function balanceOf(address user) public view returns (uint256) {
        return balances[user];
    }

    function resetBalance() public {
        require(msg.sender == owner, "You are not the owner of this account");
        for (uint i = 0; i < users.length; i++) {
            balances[users[i]] = 0;
        }
        balance = 0;
        emit ResetBalance();
    }
}