const hre = require("hardhat" );
const fs = require("fs");

async function main() {
  // Read deployed addresses
  const deployedAddresses = JSON.parse(fs.readFileSync("deployed-addresses.json", "utf8"));
  
  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Interacting with contracts using account:", deployer.address);
  
  // Get contract instances
  const sageToken = await hre.ethers.getContractAt("SAGEToken", deployedAddresses.SAGEToken);
  
  // Recipient address - replace with the address you want to send tokens to
  const recipientAddress = "0x35A3FD3D3779aF8cDe118335edA5cB7C86DBB906";
  
  // Amount to distribute (100 SAGE tokens with 18 decimals)
  const amount = hre.ethers.parseEther("100");
  
  console.log(`Distributing ${hre.ethers.formatEther(amount)} SAGE tokens to ${recipientAddress}...`);
  
  // Transfer tokens
  const tx = await sageToken.transfer(recipientAddress, amount);
  await tx.wait();
  
  console.log("Tokens distributed successfully!");
  
  // Check balance
  const balance = await sageToken.balanceOf(recipientAddress);
  console.log(`New balance of ${recipientAddress}: ${hre.ethers.formatEther(balance)} SAGE`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
