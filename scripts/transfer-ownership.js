const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Read deployed addresses
  const deployedAddresses = JSON.parse(fs.readFileSync("deployed-addresses.json", "utf8"));

  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Transferring ownership with account:", deployer.address);

  // Get contract instances
  const delayPrediction = await hre.ethers.getContractAt("DelayPrediction", deployedAddresses.DelayPrediction);
  const pythIntegrationAddress = deployedAddresses.PythIntegration;

  // Transfer ownership
  console.log(`Transferring ownership of DelayPrediction to PythIntegration (${pythIntegrationAddress})...`);
  const tx = await delayPrediction.transferOwnership(pythIntegrationAddress);
  await tx.wait();
  console.log("Ownership transferred successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 