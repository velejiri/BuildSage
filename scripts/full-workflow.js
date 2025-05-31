const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Read deployed addresses
  const deployedAddresses = JSON.parse(fs.readFileSync("deployed-addresses.json", "utf8"));
  
  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Interacting with contracts using account:", deployer.address);
  
  // Get contract instances
  const sageToken = await hre.ethers.getContractAt("SAGEToken", deployedAddresses.SAGEToken);
  const delayPrediction = await hre.ethers.getContractAt("DelayPrediction", deployedAddresses.DelayPrediction);
  const rewardDistribution = await hre.ethers.getContractAt("RewardDistribution", deployedAddresses.RewardDistribution);
  const pythIntegration = await hre.ethers.getContractAt("PythIntegration", deployedAddresses.PythIntegration);
  const blockscoutIntegration = await hre.ethers.getContractAt("BlockscoutIntegration", deployedAddresses.BlockscoutIntegration);
  
  // Test user address - replace with a test user address
  const testUser = "0x32853F82be401Df42F9ec9B1fDf63Cb0E432c93c";
  
  console.log("Starting full workflow test...");
  
  // Step 1: Update weather data
  console.log("\n1. Updating weather data...");
  let tx = await pythIntegration.fetchWeatherData("Prague", "2025-06-01");
  await tx.wait();
  console.log("Weather data updated");
  
  // Step 2: Create a prediction based on weather data
  console.log("\n2. Creating delay prediction...");
  tx = await delayPrediction.createPrediction(
    "Roofing-Phase-2",
    90,
    "Heavy rain forecast for next three days"
  );
  
  const receipt = await tx.wait();
  
  // Extract prediction ID from event
  const event = receipt.logs.find(
    log => {
      try {
        return log.fragment && log.fragment.name === 'PredictionCreated';
      } catch (e) {
        return false;
      }
    }
  );
  
  let predictionId;
  if (event && event.args) {
    predictionId = event.args[0];
    console.log(`Prediction created with ID: ${predictionId}`);
  } else {
    console.log("Prediction created, but couldn't extract ID from event");
    return;
  }
  
  // Step 3: Reward a user for contributing data
  console.log("\n3. Rewarding user for data contribution...");
  
  // First, approve the reward distribution contract to spend tokens
  const approvalAmount = hre.ethers.parseEther("1000");
  tx = await sageToken.approve(deployedAddresses.RewardDistribution, approvalAmount);
  await tx.wait();
  console.log("Approved RewardDistribution to spend SAGE tokens");
  
  // Now reward the user
  tx = await rewardDistribution.rewardDataContribution(testUser);
  await tx.wait();
  console.log(`User ${testUser} rewarded for data contribution`);
  
  // Check user's token balance
  const tokenBalance = await sageToken.balanceOf(testUser);
  console.log(`User's SAGE token balance: ${hre.ethers.formatEther(tokenBalance)}`);
  
  // Step 4: Award Blockscout Merits
  console.log("\n4. Awarding Blockscout Merits...");
  tx = await blockscoutIntegration.awardMerits(
    testUser,
    50,
    "Contributed valuable data"
  );
  await tx.wait();
  console.log("Blockscout Merits awarded");
  
  // Step 5: Resolve the prediction
  console.log("\n5. Resolving prediction...");
  tx = await delayPrediction.resolvePrediction(
    predictionId,
    "Added temporary shelter and rescheduled for next week"
  );
  await tx.wait();
  console.log("Prediction resolved");
  
  // Step 6: Reward user for taking action
  console.log("\n6. Rewarding user for taking action...");
  tx = await rewardDistribution.rewardActionTaken(testUser);
  await tx.wait();
  console.log(`User ${testUser} rewarded for taking action`);
  
  // Check user's updated token balance
  const updatedTokenBalance = await sageToken.balanceOf(testUser);
  console.log(`User's updated SAGE token balance: ${hre.ethers.formatEther(updatedTokenBalance)}`);
  
  console.log("\nFull workflow test completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
