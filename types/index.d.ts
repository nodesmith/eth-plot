declare module 'ipfs-api' {
  export = function(host: string, port: string, config: { protocol: string }): ipfs;
}

declare class files {
  add(fileInfo: {content: Buffer | Buffer, path: string}): Promise<{hash: string, path: string, size: number}[]>;
}

declare class ipfs {
  files: files;
}
