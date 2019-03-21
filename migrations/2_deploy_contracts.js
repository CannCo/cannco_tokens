const CannCoinCash = artifacts.require("CannCoinCash");

module.exports = function(deployer) {
  deployer.deploy(
    CannCoinCash, 
    1000000, 
    'CannCoinCash', 
    'CCC',
    'CannCoinCash 0.1'
  );
};
