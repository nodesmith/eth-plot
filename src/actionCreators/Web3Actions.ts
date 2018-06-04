import * as Web3 from 'web3';

import { promisify } from '../../gen-src/typechain-runtime';
import { NetworkName } from '../constants/Enums';
import { ContractInfo } from '../models';

declare global {
  interface Window { web3: Web3; }
}

const determineNetworkName = (networkId: string): NetworkName => {
  switch (networkId) {
    case '1':
      return NetworkName.Main;
    case '3':
      return NetworkName.Ropsten;
    case '4':
      return NetworkName.Rinkeby;
    case '42':
      return NetworkName.Kovan;
    case 'local_test':
    case '4447':
      return NetworkName.Local;
    default:
      return NetworkName.Unknown;
  }
};

export const getWeb3 = async (contractInfo: ContractInfo): Promise<{web3: Web3, contractAddress: string, networkName: NetworkName} | undefined> => {
  let result: Web3;
  if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    result = window.web3;
  } else if (contractInfo.web3Provider) {
    result = new Web3(new Web3.providers.HttpProvider(contractInfo.web3Provider));
  } else {
    return undefined;
  }

  // Need to get the network id from web3 to figure out which contract address we're using
  const networkId = await promisify(result.version.getNetwork, []);
  let networkName = NetworkName.Unknown;

  let contractAddress: string = '';
  if (contractInfo.contractAddress) {
    // If we have a contract address specified, just use that
    contractAddress = contractInfo.contractAddress;
  } else if (contractInfo.contractAddresses && networkId in contractInfo.contractAddresses) {
    // Find this network id in the collection of address in the config
    contractAddress = contractInfo.contractAddresses[networkId];
    networkName = determineNetworkName(networkId);
  }
  
  if (!contractAddress) {
    throw new Error(`Unable to determine contract address for network id ${networkId}`);
  }

  return {
    web3: result,
    contractAddress,
    networkName
  };
};

export function isUsingMetamask(): boolean {
  return typeof window.web3 !== 'undefined';
}
