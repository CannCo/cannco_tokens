const CanncoinCash = artifacts.require("CanncoinCash");

module.exports = function (deployer) {
  deployer.deploy(
    CanncoinCash,
    100000000,
    'Canncoin Cash',
    'CCUSD',
    'Canncoin Cash 1.0'
  );
};