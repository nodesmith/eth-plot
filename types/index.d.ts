declare module 'ipfs-api' {
  export default function(host: string, port: string, config: { protocol: string }): ipfs;
}

declare class files {
  add(fileInfo: {content: Buffer, path: string}): Promise<{hash: string, path: string, size: number}[]>;
}

declare class ipfs {
  files: files;
}

// Some definitions for the dom-based Buffer we need to use for ipfs
declare type Buffer = {};
declare type BufferStatic = { from: (foo: ArrayBuffer) => Buffer };

declare module "buffer" {
  var Buffer: BufferStatic;
}
