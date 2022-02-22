const fs = require('fs');
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployting contracts with the account : ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance : ${ethers.utils.formatEther(balance.toString())}`);
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();

  await nftMarket.deployed();

  console.log("NFT Market deployed to:", nftMarket.address);

  // We get the contract to deploy
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);

  await nft.deployed();

  console.log("NFT deployed to:", nft.address);


  const nftMarketData = {
      address: nftMarket.address,
      abi: JSON.parse(nftMarket.interface.format('json')),
  };

  const nftData = {
      address: nft.address,
      abi: JSON.parse(nft.interface.format('json')),
  }

  fs.writeFileSync('frontend/src/NFTMarket.json',JSON.stringify(nftMarketData));
  fs.writeFileSync('frontend/src/NFT.json',JSON.stringify(nftData));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
