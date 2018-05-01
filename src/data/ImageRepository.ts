import localforage from 'localforage';

if (!localforage.config({
  driver: localforage.INDEXEDDB,
  version: 1.0,
  description: 'Cache for the grid images',
  name: 'GridImages'
})) {
  throw new Error('Failed to initialize localforage');
}

export async function loadFromIpfsOrCache(ipfsHash: string, ipfsHost: string = 'https://ipfs.infura.io/ipfs'): Promise<Blob> {
  const cachedData = await localforage.getItem<Blob>(ipfsHash);
  if (cachedData) {
    console.log(`Got cached version of ${ipfsHash}`);
    return cachedData;
  }

  console.log(`Getting file from the network for ${ipfsHash}`);

  // If we don't have a cached version, we should get the image from ipfs
  const ipfsUrl = `${ipfsHost}/${ipfsHash}`;
  const response = await fetch(ipfsUrl);
  const responseBlob = await response.blob();

  // Save the blob in the cache and return it from the cache
  return localforage.setItem(ipfsHash, responseBlob);
}

