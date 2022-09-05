import { useContractCall, useContractFunction } from '@usedapp/core';
import { ethers, utils } from 'ethers';
import SyntheticNounsABI from '../libs/abi/SyntheticNouns.json';

export interface INounSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

export enum NounsTokenContractFunction {
  delegateVotes = 'votesToDelegate',
}

// TODO: Move this somewhere better
const syntheticNounsAddress = '0x8761b55aF5A703d5855F1865dB8fE4DD18E94c53';
const abi = new utils.Interface(SyntheticNounsABI);

// TODO: Use Zora API (or equivalent) to get noun minted by user if already claimed i.e.
// https://github.com/snapshot-labs/snapshot-strategies/blob/master/src/strategies/synthetic-nouns-with-claimer/index.ts#L20

export const useNounPreview = (address: string | undefined) => {
  const [b64svg] =
    useContractCall<[string]>({
      abi,
      address: syntheticNounsAddress,
      method: 'addressPreview',
      args: [address],
    }) || [];

  if (!b64svg) {
    return;
  }

  return b64svg;
};

export const useNounClaimed = (address: string | undefined) => {
  const [claimed] =
    useContractCall<[boolean]>({
      abi,
      address: syntheticNounsAddress,
      method: 'claimed',
      args: [address],
    }) || [];

  if (claimed === undefined) {
    return;
  }

  return claimed;
};

export const useClaimNoun = () => {
  const contract = new ethers.Contract(syntheticNounsAddress, abi);
  const { send: claimNoun, state: claimNounState } = useContractFunction(contract, 'claim');
  return { claimNoun, claimNounState };
};
