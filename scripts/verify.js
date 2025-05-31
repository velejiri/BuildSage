const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Read deployed addresses from file
  const addresses = JSON.parse(fs.readFileSync("deployed-addresses.json", "utf8"));
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Verifying contracts with account:", deployer.address);

  // Pyth contract address on Sepolia
  const PYTH_CONTRACT_ADDRESS = "0x2880aB155794e7179c9eE2e38200202908C17B43";

  try {
    console.log("\nVerifying SAGEToken...");
    await hre.run("verify:verify", {
      address: addresses.SAGEToken,
      constructorArguments: [deployer.address],
    });
    console.log("SAGEToken verified successfully");

    console.log("\nVerifying DelayPrediction...");
    await hre.run("verify:verify", {
      address: addresses.DelayPrediction,
      constructorArguments: [deployer.address, addresses.SAGEToken],
    });
    console.log("DelayPrediction verified successfully");

    console.log("\nVerifying RewardDistribution...");
    await hre.run("verify:verify", {
      address: addresses.RewardDistribution,
      constructorArguments: [deployer.address, addresses.SAGEToken],
    });
    console.log("RewardDistribution verified successfully");

    console.log("\nVerifying PythIntegration...");
    await hre.run("verify:verify", {
      address: addresses.PythIntegration,
      constructorArguments: [deployer.address, PYTH_CONTRACT_ADDRESS, addresses.DelayPrediction],
    });
    console.log("PythIntegration verified successfully");

    console.log("\nVerifying BlockscoutIntegration...");
    await hre.run("verify:verify", {
      address: addresses.BlockscoutIntegration,
      constructorArguments: [deployer.address],
    });
    console.log("BlockscoutIntegration verified successfully");

  } catch (error) {
    console.error("Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
