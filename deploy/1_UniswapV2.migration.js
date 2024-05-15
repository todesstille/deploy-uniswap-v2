const hre = require("hardhat");
const { Deployer, Reporter } =require("@solarity/hardhat-migrate");

// Comment toolbox and uncomment migrate and waffle inside hardhat.config.js
module.exports = async (deployer) => {
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");

  const [DEPLOYER] = await hre.ethers.getSigners();
  
  await deployer.deploy(Factory, [DEPLOYER.address]);
};
