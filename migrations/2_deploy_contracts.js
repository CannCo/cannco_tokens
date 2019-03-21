const CannCoinCash = artifacts.require("CannCoinCash");

module.exports = function(deployer) {
  deployer.deploy(CannCoinCash);
};
