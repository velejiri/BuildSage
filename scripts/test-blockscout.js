const hre = require("hardhat");

async function main() {
  // Get the BlockscoutIntegration contract
  const blockscoutIntegration = await hre.ethers.getContractAt(
    "BlockscoutIntegration",
    "0xa35eB46A5a758ac2DC894F91878bF1B14c575629" // Your deployed BlockscoutIntegration address
  );

  // Recipient address - replace with the address you want to award Merits to
  const recipientAddress = "0x35A3FD3D3779aF8cDe118335edA5cB7C86DBB906";
  
  // Award Merits
  console.log(`Awarding Blockscout Merits to ${recipientAddress}...`);
  const tx = await blockscoutIntegration.awardMerits(
    recipientAddress,
    100,
    "Contributed weather data"
  );
  
  await tx.wait();
  console.log("Merits awarded successfully!");
  
  // Check Merit balance
  const balance = await blockscoutIntegration.checkMeritBalance(recipientAddress);
  console.log(`Simulated Merit balance of ${recipientAddress}: ${balance}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });