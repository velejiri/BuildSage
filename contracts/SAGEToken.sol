// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SAGEToken is ERC20, ERC20Burnable, Ownable {
    uint256 private constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1 million tokens with 18 decimals
    
    // Events for tracking token distribution
    event RewardDistributed(address indexed recipient, uint256 amount, string reason );
    
    constructor(address initialOwner) 
        ERC20("BuildSage Token", "SAGE") 
        Ownable(initialOwner) 
    {
        _mint(initialOwner, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Distributes rewards to users who contribute data or take actions
     * @param recipient Address of the reward recipient
     * @param amount Amount of tokens to reward
     * @param reason String description of why the reward was given
     */
    function distributeReward(address recipient, uint256 amount, string memory reason) 
        external 
        onlyOwner 
    {
        require(recipient != address(0), "Cannot reward zero address");
        require(amount > 0, "Reward amount must be positive");
        
        _transfer(owner(), recipient, amount);
        
        emit RewardDistributed(recipient, amount, reason);
    }
    
    /**
     * @dev Burns tokens when users spend them on premium features
     * @param amount Amount of tokens to burn
     */
    function burnForFeature(uint256 amount) external {
        require(amount > 0, "Burn amount must be positive");
        _burn(_msgSender(), amount);
    }
}
