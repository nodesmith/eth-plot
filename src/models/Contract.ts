// https://ethereum.stackexchange.com/questions/17207/how-to-detect-if-on-mainnet-or-testnet?noredirect=1&lq=1
export type NetworkIds =
  '1' | // Main
  '3' | // Ropsten
  '4' | // Rinkeby
  '42' | // Kovan
  'local_test' | // Local ganache (see start:ganache in package.json)
  '4447'; // truffle develop

export interface ContractInfo {
  contractAddresses?: { [networkId in NetworkIds]: string };
  contractAddress?: string;
  web3Provider?: string;
}
