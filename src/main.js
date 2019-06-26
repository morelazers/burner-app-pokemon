import parseBurnerUrl from 'burner-url-parser'

import App from './App.svelte'
import stores from './stores'
import config from './config'
import bnc from 'bnc-assist'
import {
  createSdk,
  SdkEnvironmentNames,
  getSdkEnvironment
} from '@archanova/sdk'

async function initAbridged(key) {
  let sdkEnv = getSdkEnvironment(SdkEnvironmentNames.Rinkeby)
  const sdk = new createSdk(sdkEnv)
  await sdk.initialize({
    device: {
      privateKey: key
    }
  })
  return sdk
}

const ethereumDetails = parseBurnerUrl(window.location.href)
// you can now pass this to a file which sets up the wallet etc
// console.log(ethereumDetails)
// http://localhost:5000/?tokenAddress=0x27f706edde3aD952EF647Dd67E24e38CD0803DD6&networkId=100#0xaslongasthisisaprivatekeyyouaregolden

const assist = bnc.init({
  dappId: '3e5e6704-e81c-444c-a919-469194376d08',
  networkId: 100
})

let app

async function run() {
  const initialData = Object.assign(
    {},
    ethereumDetails,
    { config },
    { assist },
    { sdk: await initAbridged(ethereumDetails.privateKey) }
  )
  stores(initialData)

  // if you don't need the ethereumDetails passed to your view
  // feel free to remove the props here
  app = new App({
    target: document.body,
    props: ethereumDetails
  })
}

export default app

run()
