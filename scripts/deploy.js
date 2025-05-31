const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy SAGEToken first
  const SAGEToken = await hre.ethers.getContractFactory("SAGEToken");
  const sageToken = await SAGEToken.deploy(deployer.address);
  await sageToken.waitForDeployment();
  const sageTokenAddress = await sageToken.getAddress();
  console.log("SAGEToken deployed to:", sageTokenAddress);

  // Deploy DelayPrediction
  const DelayPrediction = await hre.ethers.getContractFactory("DelayPrediction");
  const delayPrediction = await DelayPrediction.deploy(deployer.address, sageTokenAddress);
  await delayPrediction.waitForDeployment();
  const delayPredictionAddress = await delayPrediction.getAddress();
  console.log("DelayPrediction deployed to:", delayPredictionAddress);

  // Deploy RewardDistribution
  const RewardDistribution = await hre.ethers.getContractFactory("RewardDistribution");
  const rewardDistribution = await RewardDistribution.deploy(deployer.address, sageTokenAddress);
  await rewardDistribution.waitForDeployment();
  const rewardDistributionAddress = await rewardDistribution.getAddress();
  console.log("RewardDistribution deployed to:", rewardDistributionAddress);

  // Deploy PythIntegration
  // Note: For Sepolia, you'll need to replace this with the actual Pyth contract address
  const PYTH_CONTRACT_ADDRESS = "0x2880aB155794e7179c9eE2e38200202908C17B43"; // Sepolia Pyth address
  const PythIntegration = await hre.ethers.getContractFactory("PythIntegration");
  const pythIntegration = await PythIntegration.deploy(
    deployer.address,
    PYTH_CONTRACT_ADDRESS,
    delayPredictionAddress
  );
  await pythIntegration.waitForDeployment();
  const pythIntegrationAddress = await pythIntegration.getAddress();
  console.log("PythIntegration deployed to:", pythIntegrationAddress);

  // Deploy BlockscoutIntegration
  const BlockscoutIntegration = await hre.ethers.getContractFactory("BlockscoutIntegration");
  const blockscoutIntegration = await BlockscoutIntegration.deploy(deployer.address);
  await blockscoutIntegration.waitForDeployment();
  const blockscoutIntegrationAddress = await blockscoutIntegration.getAddress();
  console.log("BlockscoutIntegration deployed to:", blockscoutIntegrationAddress);

  // Save addresses to a file
  const addresses = {
    SAGEToken: sageTokenAddress,
    DelayPrediction: delayPredictionAddress,
    RewardDistribution: rewardDistributionAddress,
    PythIntegration: pythIntegrationAddress,
    BlockscoutIntegration: blockscoutIntegrationAddress
  };

  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );

  // Output all addresses in the requested format
  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(addresses, null, 2));

  // Wait a bit to ensure all transactions are mined
  console.log("\nWaiting for block confirmations...");
  await new Promise(resolve => setTimeout(resolve, 30000));

  // Verify contracts on Etherscan
  console.log("\nVerifying contracts on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: sageTokenAddress,
      constructorArguments: [deployer.address],
    });
    console.log("SAGEToken verified");

    await hre.run("verify:verify", {
      address: delayPredictionAddress,
      constructorArguments: [deployer.address, sageTokenAddress],
    });
    console.log("DelayPrediction verified");

    await hre.run("verify:verify", {
      address: rewardDistributionAddress,
      constructorArguments: [deployer.address, sageTokenAddress],
    });
    console.log("RewardDistribution verified");

    await hre.run("verify:verify", {
      address: pythIntegrationAddress,
      constructorArguments: [deployer.address, PYTH_CONTRACT_ADDRESS, delayPredictionAddress],
    });
    console.log("PythIntegration verified");

    await hre.run("verify:verify", {
      address: blockscoutIntegrationAddress,
      constructorArguments: [deployer.address],
    });
    console.log("BlockscoutIntegration verified");
  } catch (error) {
    console.log("Verification failed:", error.message);
    console.log("\nYou can verify the contracts later using:");
    console.log("npx hardhat run scripts/verify.js --network sepolia");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
