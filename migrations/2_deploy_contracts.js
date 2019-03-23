const CanncoinCash = artifacts.require("CanncoinCash");

module.exports = function(deployer) {
  deployer.deploy(
    CanncoinCash, 
    1000000, 
    'Canncoin Cash', 
    'CASH',
    'Canncoin Cash 1.0'
  );
};
