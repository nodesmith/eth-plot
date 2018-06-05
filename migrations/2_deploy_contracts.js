var EthPlot = artifacts.require("./EthPlot.sol");

module.exports = function(deployer) {
  deployer.deploy(EthPlot);
};