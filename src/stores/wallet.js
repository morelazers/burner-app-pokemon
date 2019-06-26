import { ethers } from 'ethers'
import { writable } from 'svelte/store'
import { ethToWei } from '@netgum/utils'
import uuid from 'uuid'

// this is the object which will let us do all the funky things like send
// tokens, sign messages, etc. we'll bind all the functions to the wallet obj
export let wallet

// the following are not exported, they are instead script variables which are
// used when we send assets and do wallet operations from elsewhere. these are
let tokenContract
let ethersWallet
let assist

/**
 * Initialise the wallet store, and set up a few helper functions for refreshing
 * the wallet etc.
 * @param {Object} options Burner wallet initialisation options
 */
export default async function init(state) {
  // this is all very opinionated
  const { privateKey, networkId, tokenAddress, config, sdk } = state
  const { NETWORKS, TOKEN_ABI, CURRENCY_SYMBOL } = config
  assist = state.assist

  // our export
  wallet = {
    // sendEth: (...args) => wallet.sendBaseAsset(...args),
    // sendBaseAsset: (...args) => sendBaseAsset(...args), // could be ETH/xDAI
    sendTokens: (...args) => sendTokenTransaction(...args),
    tokenBalance: writable(0),
    baseAssetBalance: writable(0),
    tokenBalanceOf: async address => await getTokenBalance(address),
    notify: (...args) => assist.notify(...args),
    account: await getAccount(privateKey)
  }

  // we need to do this once when we load the app
  setTokenBalance(await getTokenBalance(wallet.address))
  setupBalanceWatchers(wallet.address)

  async function getAccount() {
    const accounts = await sdk.getConnectedAccounts()
    if (accounts.items.length === 0) {
      console.log('Creating an account')
      return await sdk.createAccount('flex-pokemon-' + uuid.v4())
    } else {
      console.log('Connecting to account', accounts.items[0].address)
      return await sdk.connectAccount(accounts.items[0].address)
    }
  }

  async function depositVirtual(eth) {
    return await doTx(
      await sdk.estimateTopUpAccountVirtualBalance(ethToWei(eth))
    )
  }

  async function withdrawVirtual(eth) {
    return await doTx(
      await sdk.estimateWithdrawFromAccountVirtualBalance(ethToWei(eth))
    )
  }

  async function doTx(estimate) {
    return await submitAccountTransaction(estimate)
  }

  async function sendPayment(to, value, messages) {}

  async function depositPayment(hash) {}

  async function depositPayments(hashes) {}

  async function sendEth(to, value, messages) {}

  async function sendEthWithData(to, value, data, messages) {}

  async function sendErc20(tokenAddress, to, value, messages) {}

  async function sendErc223(tokenAddress, to, value, bytes, string, messages) {}

  // @andrew
  async function sendErc777(tokenAddress, to, value, messages) {}

  async function sendErc721(tokenAddress, id, to, value, messages) {}

  async function sendTokenTransaction(
    to,
    value,
    bytes = '0x',
    string = 'tokenFallback',
    options,
    messages
  ) {
    // console.log(string)
    // const txMessages = Object.assign(
    //   getDefaultTokenMessages(CURRENCY_SYMBOL, value),
    //   messages
    // )
    // const dismiss = assist.notify('pending', txMessages.txSent(), {
    //   customTimeout: -1
    // })
    // const nonce = await provider.getTransactionCount(
    //   ethersWallet.address,
    //   'pending'
    // )
    // const tx = tokenContract['transfer(address,uint256,bytes,string)'](
    //   to,
    //   value,
    //   bytes,
    //   string,
    //   {
    //     gasPrice: 1, // default on xDAI
    //     gasLimit: 500000,
    //     nonce: nonce
    //   }
    // )
    // tx.catch(() => {
    //   dismiss()
    //   assist.notify('error', txMessages.txStall())
    // })
    // tx.then(async r => {
    //   await r.wait()
    //   dismiss()
    //   assist.notify('success', txMessages.txConfirmed())
    // })
    // return tx
  }

  function setupBalanceWatchers(walletAddress) {
    // sometimes this listener fires twice??
    // tokenContract.on(
    //   tokenContract.filters.Transfer(null, null),
    //   async (f, t, v) => {
    //     console.log('-- GOT A TRANSFER EVENT --')
    //     console.log({ f, t, v })
    //     if (t.toLowerCase() === walletAddress.toLowerCase()) {
    //       assist.notify(
    //         'success',
    //         `Received ${CURRENCY_SYMBOL}${v.toNumber().toLocaleString()}!`
    //       )
    //       setTokenBalance(await getTokenBalance(walletAddress))
    //     } else if (f.toLowerCase() === walletAddress.toLowerCase()) {
    //       setTokenBalance(await getTokenBalance(walletAddress))
    //     }
    //   }
    // )
    // this actually fires once to get the initial balance, so we don't need to
    // initialise it first, which is handy but a little confusing, as the
    // behaviour for a token is different
    // provider.on(walletAddress, balance => {
    //   setBaseAssetBalance(ethers.utils.formatEther(balance))
    // })
  }

  async function getTokenBalance(address) {
    // @todo some weird shit with abridged to make the call

    return 0
    // return await tokenContract.balanceOf(address)
  }

  function setTokenBalance(b) {
    console.log('-- SETTING TOKEN BALANCE TO --', b)
    wallet.tokenBalance.set(b)
  }

  function setBaseAssetBalance(b) {
    wallet.baseAssetBalance.set(b)
  }
}

function getDefaultMessages(currencySymbol, value) {
  return {
    txSent: () => `Sending ${currencySymbol}${Number(value).toLocaleString()}`,
    txConfirmed: () =>
      `Sent ${currencySymbol}${Number(value).toLocaleString()}`,
    txStall: () => `Something's wrong...`,
    txConfirmed: () => `Sent ${currencySymbol}${Number(value).toLocaleString()}`
  }
}
