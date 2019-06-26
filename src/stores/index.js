import wallet from './wallet'
import dapp from './dapp'

export default function(state) {
  wallet(state)
  dapp(state)
}
