const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Test template", function () {

  let admin, alice, bob;

  before(async () => {
    [admin, alice, bob] = await ethers.getSigners();
  });

  beforeEach(async () => {
    const MockToken = await ethers.getContractFactory("MockToken");
    const WETH9 = await ethers.getContractFactory("WETH9");
    const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
    const UniswapV2Router01 = await ethers.getContractFactory("UniswapV2Router01");
    const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
    
    factoryV2 = await UniswapV2Factory.deploy(admin.address);
    token0 = await MockToken.deploy("Mock Token 0", "MCK0", "1000000000000000000000000000");
    token1 = await MockToken.deploy("Mock Token 1", "MCK1", "1000000000000000000000000000");

    weth = await WETH9.deploy();
    router1 = await UniswapV2Router01.deploy(factoryV2.address, weth.address);
    router2 = await UniswapV2Router02.deploy(factoryV2.address, weth.address);
  });

  describe("Tokens", function () {
    it("balance", async () => {
      expect(await token0.balanceOf(admin.address)).to.equal("1000000000000000000000000000");
      expect(await token1.balanceOf(admin.address)).to.equal("1000000000000000000000000000");
    });

    it("initialize", async () => {
      await factoryV2.createPair(token0.address, token1.address);
      const pairAddress = await factoryV2.allPairs(0);
      const pair = await ethers.getContractAt("UniswapV2Pair", pairAddress);

      expect((await pair.getReserves())[0]).to.equal(0);
      expect((await pair.getReserves())[1]).to.equal(0);

      await token0.transfer(pair.address, "10000000000000000000");
      await token1.transfer(pair.address, "10000000000000000000");

      await pair.mint(admin.address);
      expect(await pair.balanceOf(admin.address)).to.equal("9999999999999999000");

      await token0.approve(router2.address, 100000);
      await router2.swapExactTokensForTokens(100000, 0, [token0.address, token1.address], admin.address, 9999999999)
    });
  });
});