declare type _contractTest = (accounts: string[]) => void;
declare function contract(name: string, test: _contractTest): void;
declare interface TransactionMeta {
  from: string,
}

declare interface Contract<T> {
  "new"(): Promise<T>,
  deployed(): Promise<T>,
  at(address: string): T,
}

declare interface DeployedContract {
  address: string;
}

interface Artifacts {
  require<T>(name: string): Contract<DeployedContract>
}

declare var artifacts: Artifacts;
