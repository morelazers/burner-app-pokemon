import { ethers } from 'ethers'
import { readable, writable } from 'svelte/store'
import { wallet } from './wallet'

export let dapp

let contract

/**
 * Okey dokey, so we have the ability to do some things here.
 * It would be wonderful if:
 *  - We could sign transactions on the plasma network with the same private key
 *  - Those transactions would remove some of the funds from our wallet
 *  - Obviously this is not really possible, unfortunately, neither is the x-chain comms
 *
 * So, what we might have to do instead is something like:
 *  - Spend your flexbuxx on "credits" which are then given to you on the plasma network
 *  - I think this might be possible with Matic
 *
 */

export default async function init(state) {
  const { CURRENCY_SYMBOL } = state.config
  // okay - let's build our fkn dapp

  // set our initial dapp state
  // let nonce = await wallet.nonce()
  dapp = {
    streamLoaded: writable(false),
    address: '0xe0728a9d55ebd03bfcc6e9faa59e6dfe96741636', // put our dapp address in here
    status: writable('READY'),
    press: async num => {
      dapp.status.set('WAITING')
      const tx = await dapp.contract.makeAction(num)
      await tx.wait()
      dapp.status.set('READY')
    },
    abi: [
      {
        constant: false,
        inputs: [
          {
            name: 'action',
            type: 'uint8'
          }
        ],
        name: 'makeAction',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: 'action',
            type: 'uint8'
          }
        ],
        name: 'ActionMade',
        type: 'event'
      }
    ]
  }

  // dapp.contract = new ethers.Contract(
  //   dapp.address,
  //   dapp.abi,
  //   wallet.provider
  // ).connect(wallet.signer)

  // dapp.contract.on(dapp.contract.filters.ActionMade(), action => {
  // console.log(action)
  // })
}
