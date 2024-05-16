const hre = require("hardhat");
const { Deployer, Reporter } =require("@solarity/hardhat-migrate");
require('dotenv').config();

// Comment toolbox and uncomment migrate and waffle inside hardhat.config.js
module.exports = async (deployer) => {
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");

  const [DEPLOYER] = await hre.ethers.getSigners();
  
  const factory = await deployer.deploy(Factory, [DEPLOYER.address]);

  const WETH = process.env.WETH;

  const UniswapV2Router01 = await hre.ethers.getContractFactory("UniswapV2Router01");
  const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");

  const router1 = await deployer.deploy(UniswapV2Router01, [factory.address, WETH]);
  const router2 = await deployer.deploy(UniswapV2Router02, [factory.address, WETH]);
  
};
