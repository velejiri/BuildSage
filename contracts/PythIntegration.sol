// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DelayPrediction.sol";

interface IPyth {
    function getPriceUnsafe(bytes32 id) external view returns (int64, int32, uint);
    function getUpdateFee(uint updateDataSize) external view returns (uint);
    function updatePriceFeeds(bytes[] calldata updateData) external payable;
}

contract PythIntegration is Ownable {
    IPyth public pythContract;
    DelayPrediction public delayPrediction;
    
    // Mapping of weather condition IDs to Pyth price feed IDs
    mapping(string => bytes32) public weatherFeedIds;
    
    // Events
    event WeatherDataUpdated(string location, string condition, int256 temperature);
    
    constructor(address initialOwner, address pythAddress, address delayPredictionAddress) Ownable(initialOwner) {
        pythContract = IPyth(pythAddress);
        delayPrediction = DelayPrediction(delayPredictionAddress);
        
        // For the hackathon, we'll use mock IDs
        // In a real implementation, these would be actual Pyth price feed IDs
        weatherFeedIds["temperature"] = bytes32(uint256(keccak256("temperature")));
        weatherFeedIds["precipitation"] = bytes32(uint256(keccak256("precipitation")));
    }
    
    /**
     * @dev Updates price feeds from Pyth Network
     * @param updateData The update data from Pyth Network
     */
    function updatePriceFeeds(bytes[] calldata updateData) external payable {
        uint fee = pythContract.getUpdateFee(updateData.length);
        pythContract.updatePriceFeeds{value: fee}(updateData);
    }
    
    /**
     * @dev Fetches weather data from Pyth and updates the DelayPrediction contract
     * @param location Location identifier
     * @param date Date string (YYYY-MM-DD)
     */
    function fetchWeatherData(string memory location, string memory date) external {
        // In a real implementation, we would fetch multiple data points
        // For the hackathon, we'll simulate with temperature only
        
        // Get temperature from Pyth
        (int64 price, int32 expo, ) = pythContract.getPriceUnsafe(weatherFeedIds["temperature"]);
        
        // Convert to Celsius (assuming the feed gives temperature in Celsius * 10^expo)
        int256 temperature;
        uint256 absExpo = expo >= 0 ? uint256(uint32(expo)) : uint256(uint32(-expo));
        if (expo >= 0) {
            temperature = int256(price) * int256(10 ** absExpo);
        } else {
            temperature = int256(price) / int256(10 ** absExpo);
        }
        
        // Determine weather condition based on temperature
        string memory condition;
        if (temperature < 0) {
            condition = "snow";
        } else if (temperature < 1500) { // 15°C
            condition = "cold";
        } else if (temperature < 2500) { // 25°C
            condition = "mild";
        } else {
            condition = "hot";
        }
        
        // Update the DelayPrediction contract
        delayPrediction.updateWeatherData(
            location,
            date,
            condition,
            temperature,
            "Pyth Network"
        );
        
        emit WeatherDataUpdated(location, condition, temperature);
    }
    
    /**
     * @dev Updates a weather feed ID
     * @param feedType The type of weather feed
     * @param feedId The Pyth price feed ID
     */
    function updateWeatherFeedId(string memory feedType, bytes32 feedId) external onlyOwner {
        weatherFeedIds[feedType] = feedId;
    }
    
    /**
     * @dev Withdraws ETH from the contract
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(amount);
    }
    
    // Function to receive ETH
    receive() external payable {}
}
