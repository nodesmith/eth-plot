import nodeFetch from 'node-fetch';
import * as Web3 from 'web3';
import { EthPlot } from '../gen-src/EthPlot';
import { S3 } from 'aws-sdk';


// Simple script for uploading any images which have been submitted to ipfs to S3 as well for faster loading times

if (process.argv.length !== 7) {
  throw "Usages: uploadExistingPlotImages <ipfsUrl> <web3Provider> <contractAddress> <s3Bucket> <s3KeyPrefix>"
}



export const downloadFromIpfs = async (ipfsUrlBase: string, ipfsHash: string) => {
  const ipfsUrl = `${ipfsUrlBase}/${ipfsHash}`;
  const response = await nodeFetch(ipfsUrl);
  const responseBlob = await response.buffer();
  return responseBlob;
}

const getImagesFromWeb3 = async (web3Provider: string, contractAddress: string) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(web3Provider));
  const contract = await EthPlot.createAndValidate(web3, contractAddress);
  const totalNumberOfPlots = (await contract.ownershipLength).toNumber();
  const result = new Array<string>();
  for (let i = 0; i < totalNumberOfPlots; i++) {
    const plotData = await contract.getPlotData(i);
    const ipfsHash = plotData[1];
    result.push(ipfsHash);
    console.log(`Got Ipfs hash ${ipfsHash}`);
  }

  return result;
}

(async () => {
  const ipfsUrlBase = process.argv[2];
  const web3Provider = process.argv[3];
  const contractAddress = process.argv[4];
  const s3Bucket = process.argv[5];
  const s3KeyPrefix = process.argv[6];

  const ipfsHashes = await getImagesFromWeb3(web3Provider, contractAddress);
  console.log(ipfsHashes);

  const s3 = new S3({
    region: 'us-west-2'
  });

  const files = ipfsHashes.map(async (ipfsHash) => {
    const fileBlob = await downloadFromIpfs(ipfsUrlBase, ipfsHash);
    const key = `${s3KeyPrefix}/${ipfsHash}`;
    let mimeType = '';
    switch (ipfsHash.split('.').pop())
    {
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'svg':
        mimeType = 'image/svg+xml';
        break;
      default:
        throw 'Unknown mime type'
    }
    
    const result = await s3.putObject({
      Bucket: s3Bucket,
      Body: fileBlob,
      ACL: 'public-read',
      Key: key,
      ContentType: mimeType
    }).promise();

    console.log(result.$response.data);
  });

  await Promise.all(files);
})();
