import {
  u128,
  ContractPromiseBatch,
} from "near-sdk-as";

import {
  TokensById,
  TokenMetadataById
} from "./index";

import {
  assert_one_yocto,
  assert_at_least_one_yocto,
  refund_approved_account_ids,
  refund_approved_account_ids_iter,
  internal_transfer,
  internal_add_token_to_owner,
  internal_remove_token_from_owner,
} from "./internal";

import {
  JsonToken,

} from "./token";

import { 
  Gas,
  AccountId,
  Balance,
  TokenId,
  
} from "./types";

export const GAS_FOR_NFT_APPROVE: Gas = 10_000_000_000_000;
export const GAS_FOR_RESOLVE_TRANSFER: Gas = 10_000_000_000_000;
export const GAS_FOR_NFT_TRANSFER_CALL: Gas = 25_000_000_000_000 + GAS_FOR_RESOLVE_TRANSFER;
export const NO_DEPOSIT: Balance = u128.from(0);

// NonFungibleTokenCore functions extracted from nft-simple rust 
export function nft_transfer(receiver_id: AccountId, token_id: TokenId, approval_id: u64, memo: string): void {
  // assert_one_yocto();
  // 
  // let sender_id = env::predecessor_account_id();
  // let previous_token = self.internal_transfer(
  //     &sender_id,
  //     receiver_id.as_ref(),
  //     &token_id,
  //     approval_id,
  //     memo,
  // );
  // refund_approved_account_ids(
  //     previous_token.owner_id,
  //     &previous_token.approved_account_ids,
  // );
}

export function nft_transfer_call(receiver_id: AccountId, token_id: TokenId, approval_id: u64, memo: string, msg: string): void { // should return Promise/ContractPromiseBatch
  assert_one_yocto();
  // let sender_id = env::predecessor_account_id();
  // let previous_token = self.internal_transfer(
  //     &sender_id,
  //     receiver_id.as_ref(),
  //     &token_id,
  //     approval_id,
  //     memo,
  // );
  // // Initiating receiver's call and the callback
  // ext_non_fungible_token_receiver::nft_on_transfer(
  //     sender_id,
  //     previous_token.owner_id.clone(),
  //     token_id.clone(),
  //     msg,
  //     receiver_id.as_ref(),
  //     NO_DEPOSIT,
  //     env::prepaid_gas() - GAS_FOR_NFT_TRANSFER_CALL,
  // )
  // .then(ext_self::nft_resolve_transfer(
  //     previous_token.owner_id,
  //     receiver_id.into(),
  //     previous_token.approved_account_ids,
  //     token_id,
  //     &env::current_account_id(),
  //     NO_DEPOSIT,
  //     GAS_FOR_RESOLVE_TRANSFER,
  // ))
}

export function nft_approve(token_id: TokenId, account_id: AccountId, msg: string | null): void {
  // assert_at_least_one_yocto();
  // let account_id: AccountId = account_id.into();
  // 
  // let mut token = self.tokens_by_id.get(&token_id).expect("Token not found");
  // 
  // assert_eq!(
  //     &env::predecessor_account_id(),
  //     &token.owner_id,
  //     "Predecessor must be the token owner."
  // );
  // 
  // let approval_id: U64 = token.next_approval_id.into();
  // let is_new_approval = token
  //     .approved_account_ids
  //     .insert(account_id.clone(), approval_id)
  //     .is_none();
  // 
  // let storage_used = if is_new_approval {
  //     bytes_for_approved_account_id(&account_id)
  // } else {
  //     0
  // };
  // 
  // token.next_approval_id += 1;
  // self.tokens_by_id.insert(&token_id, &token);
  // 
  // refund_deposit(storage_used);
  // 
  // if let Some(msg) = msg {
  //     ext_non_fungible_approval_receiver::nft_on_approve(
  //         token_id,
  //         token.owner_id,
  //         approval_id,
  //         msg,
  //         &account_id,
  //         NO_DEPOSIT,
  //         env::prepaid_gas() - GAS_FOR_NFT_APPROVE,
  //     )
  //     .as_return(); // Returning this promise
  // }
}

export function nft_revoke(token_id: TokenId, account_id: AccountId): void {
  assert_one_yocto();
  // let mut token = self.tokens_by_id.get(&token_id).expect("Token not found");
  // let predecessor_account_id = env::predecessor_account_id();
  // assert_eq!(&predecessor_account_id, &token.owner_id);
  // if token
  //     .approved_account_ids
  //     .remove(account_id.as_ref())
  //     .is_some()
  // {
  //     refund_approved_account_ids_iter(predecessor_account_id, [account_id.into()].iter());
  //     self.tokens_by_id.insert(&token_id, &token);
  // }
}

export function nft_revoke_all(token_id: TokenId): void {
  assert_one_yocto();
  // let mut token = self.tokens_by_id.get(&token_id).expect("Token not found");
  // let predecessor_account_id = env::predecessor_account_id();
  // assert_eq!(&predecessor_account_id, &token.owner_id);
  // if !token.approved_account_ids.is_empty() {
  //     refund_approved_account_ids(predecessor_account_id, &token.approved_account_ids);
  //     token.approved_account_ids.clear();
  //     self.tokens_by_id.insert(&token_id, &token);
  // }
}

export function nft_total_supply(): u64 {
  self.token_metadata_by_id.len().into()
  return 0;
}
// should return JsonToken, 
export function nft_token(token_id: TokenId): string {
  // if let Some(token) = self.tokens_by_id.get(&token_id) {
  //   let metadata = self.token_metadata_by_id.get(&token_id).unwrap();
  //   Some(JsonToken {
  //       token_id,
  //       owner_id: token.owner_id,
  //       metadata,
  //       approved_account_ids: token.approved_account_ids,
  //   })
  // } else {
  //     None
  // }
  return "";
}

// NFT Event receiver
// NonFungibleTokenReceiver
export function nft_on_transfer(sender_id: AccountId, previous_owner_id: AccountId, approval_id: u64, msg: string): void { // should return ContractPromiseBatch
  // return new Promise()
}

// NonFungibleTokenApprovalsReceiver
export function nft_on_approve(token_id: TokenId, owner_id: AccountId, approval_id: u64, msg: string): void {
  
}

// NonFungibleTokenResolver
export function nft_resolve_transfer(owner_id: AccountId, receiver_id: AccountId, approved_account_ids: HashMap, token_id: TokenId): boolean {
  // Whether receiver wants to return token back to the sender, based on `nft_on_transfer`
  // // call result.
  // if let PromiseResult::Successful(value) = env::promise_result(0) {
  //     if let Ok(return_token) = near_sdk::serde_json::from_slice::<bool>(&value) {
  //         if !return_token {
  //             // Token was successfully received.
  //             refund_approved_account_ids(owner_id, &approved_account_ids);
  //             return true;
  //         }
  //     }
  // }
  // 
  // let mut token = if let Some(token) = self.tokens_by_id.get(&token_id) {
  //     if &token.owner_id != &receiver_id {
  //         // The token is not owner by the receiver anymore. Can't return it.
  //         refund_approved_account_ids(owner_id, &approved_account_ids);
  //         return true;
  //     }
  //     token
  // } else {
  //     // The token was burned and doesn't exist anymore.
  //     refund_approved_account_ids(owner_id, &approved_account_ids);
  //     return true;
  // };
  // 
  // log!("Return {} from @{} to @{}", token_id, receiver_id, owner_id);
  // 
  // self.internal_remove_token_from_owner(&receiver_id, &token_id);
  // self.internal_add_token_to_owner(&owner_id, &token_id);
  // token.owner_id = owner_id;
  // refund_approved_account_ids(receiver_id, &token.approved_account_ids);
  // token.approved_account_ids = approved_account_ids;
  // self.tokens_by_id.insert(&token_id, &token);
  // 
  // false
  return true;
}

// TODO: create nft_on_revoke event accourding to NEAR/core-contracts/nft-simple/src/nft_core.rs
export function nft_on_revoke(): void {

}