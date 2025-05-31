// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SAGEToken.sol";

contract DelayPrediction is Ownable {
    SAGEToken public sageToken;
    
    // Struct to store prediction details
    struct Prediction {
        string taskId;
        uint256 riskScore; // 0-100, higher means higher risk
        string reason;
        uint256 timestamp;
        address predictor;
        bool resolved;
        string resolution;
    }
    
    // Struct to store weather data
    struct WeatherData {
        string location;
        string condition; // e.g., "rain", "clear", "snow"
        int256 temperature; // in Celsius, multiplied by 100 (e.g., 2350 = 23.5°C)
        uint256 timestamp;
        string source; // e.g., "Pyth Network"
    }
    
    // Mapping to store predictions by ID
    mapping(bytes32 => Prediction) public predictions;
    
    // Array to store all prediction IDs
    bytes32[] public predictionIds;
    
    // Mapping to store weather data by location and date
    mapping(bytes32 => WeatherData) public weatherData;
    
    // Events
    event PredictionCreated(bytes32 indexed id, string taskId, uint256 riskScore, string reason);
    event PredictionResolved(bytes32 indexed id, bool resolved, string resolution);
    event WeatherDataUpdated(string location, string date, string condition, int256 temperature);
    
    constructor(address initialOwner, address tokenAddress) Ownable(initialOwner) {
        sageToken = SAGEToken(tokenAddress);
    }
    
    /**
     * @dev Creates a new delay prediction
     * @param taskId Identifier for the construction task
     * @param riskScore Risk score from 0-100
     * @param reason Reason for the prediction
     * @return id The unique identifier for the prediction
     */
    function createPrediction(
        string memory taskId,
        uint256 riskScore,
        string memory reason
    ) external onlyOwner returns (bytes32) {
        require(riskScore <= 100, "Risk score must be between 0 and 100");
        
        bytes32 id = keccak256(abi.encodePacked(taskId, block.timestamp));
        
        predictions[id] = Prediction({
            taskId: taskId,
            riskScore: riskScore,
            reason: reason,
            timestamp: block.timestamp,
            predictor: msg.sender,
            resolved: false,
            resolution: ""
        });
        
        predictionIds.push(id);
        
        emit PredictionCreated(id, taskId, riskScore, reason);
        
        return id;
    }
    
    /**
     * @dev Resolves a prediction (marks it as handled)
     * @param id The prediction ID
     * @param resolution Description of how the prediction was resolved
     */
    function resolvePrediction(bytes32 id, string memory resolution) external onlyOwner {
        require(predictions[id].timestamp > 0, "Prediction does not exist");
        require(!predictions[id].resolved, "Prediction already resolved");
        
        predictions[id].resolved = true;
        predictions[id].resolution = resolution;
        
        emit PredictionResolved(id, true, resolution);
    }
    
    /**
     * @dev Updates weather data from oracle
     * @param location Location identifier
     * @param date Date string (YYYY-MM-DD)
     * @param condition Weather condition
     * @param temperature Temperature in Celsius (multiplied by 100)
     * @param source Source of the weather data
     */
    function updateWeatherData(
        string memory location,
        string memory date,
        string memory condition,
        int256 temperature,
        string memory source
    ) external onlyOwner {
        bytes32 id = keccak256(abi.encodePacked(location, date));
        
        weatherData[id] = WeatherData({
            location: location,
            condition: condition,
            temperature: temperature,
            timestamp: block.timestamp,
            source: source
        });
        
        emit WeatherDataUpdated(location, date, condition, temperature);
    }
    
    /**
     * @dev Gets all prediction IDs
     * @return Array of prediction IDs
     */
    function getAllPredictionIds() external view returns (bytes32[] memory) {
        return predictionIds;
    }
    
    /**
     * @dev Gets prediction details by ID
     * @param id The prediction ID
     * @return taskId The task identifier
     * @return riskScore The risk score (0-100)
     * @return reason The reason for the prediction
     * @return timestamp When the prediction was made
     * @return predictor Address of the predictor
     * @return resolved Whether the prediction was resolved
     * @return resolution How the prediction was resolved
     */
    function getPrediction(bytes32 id) external view returns (
        string memory taskId,
        uint256 riskScore,
        string memory reason,
        uint256 timestamp,
        address predictor,
        bool resolved,
        string memory resolution
    ) {
        Prediction memory p = predictions[id];
        return (
            p.taskId,
            p.riskScore,
            p.reason,
            p.timestamp,
            p.predictor,
            p.resolved,
            p.resolution
        );
    }
}
