// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SAGEToken.sol";

contract RewardDistribution is Ownable {
    SAGEToken public sageToken;
    
    // Reward amounts
    uint256 public dataContributionReward = 5 * 10**18; // 5 SAGE tokens
    uint256 public actionTakenReward = 10 * 10**18; // 10 SAGE tokens
    
    // Mapping to track user contributions
    mapping(address => uint256) public userContributions;
    
    // Events
    event RewardDistributed(address indexed user, uint256 amount, string contributionType);
    event RewardAmountUpdated(string contributionType, uint256 newAmount);
    
    constructor(address initialOwner, address tokenAddress) Ownable(initialOwner) {
        sageToken = SAGEToken(tokenAddress);
    }
    
    /**
     * @dev Rewards a user for contributing data
     * @param user Address of the user to reward
     */
    function rewardDataContribution(address user) external onlyOwner {
        require(user != address(0), "Cannot reward zero address");
        
        sageToken.distributeReward(user, dataContributionReward, "Data Contribution");
        userContributions[user] += 1;
        
        emit RewardDistributed(user, dataContributionReward, "Data Contribution");
    }
    
    /**
     * @dev Rewards a user for taking action on a prediction
     * @param user Address of the user to reward
     */
    function rewardActionTaken(address user) external onlyOwner {
        require(user != address(0), "Cannot reward zero address");
        
        sageToken.distributeReward(user, actionTakenReward, "Action Taken");
        userContributions[user] += 1;
        
        emit RewardDistributed(user, actionTakenReward, "Action Taken");
    }
    
    /**
     * @dev Updates the reward amount for data contributions
     * @param newAmount New reward amount
     */
    function updateDataContributionReward(uint256 newAmount) external onlyOwner {
        dataContributionReward = newAmount;
        emit RewardAmountUpdated("Data Contribution", newAmount);
    }
    
    /**
     * @dev Updates the reward amount for actions taken
     * @param newAmount New reward amount
     */
    function updateActionTakenReward(uint256 newAmount) external onlyOwner {
        actionTakenReward = newAmount;
        emit RewardAmountUpdated("Action Taken", newAmount);
    }
    
    /**
     * @dev Gets the number of contributions by a user
     * @param user User address
     * @return Number of contributions
     */
    function getUserContributions(address user) external view returns (uint256) {
        return userContributions[user];
    }
}
