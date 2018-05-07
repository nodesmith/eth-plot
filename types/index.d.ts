declare module 'ipfs-api' {
  function defaultFunction(host: string, port: string, config: { protocol: string }): ipfs;
  export = defaultFunction;
}

declare class files {
  add(fileInfo: {content: Buffer | Buffer, path: string}): Promise<{hash: string, path: string, size: number}[]>;
}

declare class ipfs {
  files: files;
}
