<script>
  import QRCode from "qrcode";

  import { wallet } from "./stores/wallet";
  import { dapp } from "./stores/dapp";

  export let tokenAddress;
  export let networkId;
  export let privateKey;

  // let tokenBalance = wallet.tokenBalance;
  let { streamLoaded, status } = dapp;
</script>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    background: #2a333e;
    font-family: "VT323";
  }
  .bg {
    z-index: 2;
    height: 100vh;
    width: 100vw;
    position: absolute;
  }
  .stream {
    margin-top: 3.5vh;
    padding-bottom: 10vh;
  }
  #twitch-embed {
    height: 40%;
    width: 100vw;
    background: red;
    z-index: 1;
  }
  h3 {
    color: #a7e4ae;
  }
  button {
    z-index: 3;
    border: none;
    color: #4c4c4c;
    background: #2d2d2d;
    height: 10vh;
    width: 10vh;
  }
  button:disabled {
    background: #2d2d2d55;
  }
  .arrow {
    width: 5vh;
    height: 5vh;
    margin: 0;
  }
  .arrow-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .arrow.horizontal {
    margin: 0 15px;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .system {
    justify-content: center;
  }
  .system button {
    margin: 5px;
  }
  .directions {
    margin-top: 6vh;
    margin-left: -1vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .actions {
    margin-top: 8vh;
    font-size: 2rem;
    display: flex;
  }
  .actions button {
    height: 7vh;
    width: 7vh;
    border-radius: 50px;
  }
  .btn-b {
    margin: 5vh 2vh 0 1vh;
  }
  .btn-a {
    margin: 2vh -2vh 0 0;
  }
  .system button {
    height: 3vh;
    margin-top: 9vh;
  }
  .infront {
    z-index: 5;
  }
</style>

<img class="bg" src="/assets/bg.png" />
<!-- <iframe
  class="stream"
  src="https://player.twitch.tv/?channel=flexdapps"
  height="40%"
  width="100%"
  frameborder="0"
  scrolling="no"
  muted="true"
  allowfullscreen="false" /> -->
<div id="twitch-embed" />

<!-- <h3>Token: {tokenAddress}</h3> -->
<!-- <h3>Network: {networkId}</h3> -->
<!-- <h3>Private Key: {privateKey}</h3> -->
<!-- <h3>Address: {wallet.address}</h3> -->
<!-- <h3>Token Balance: {$tokenBalance}</h3> -->
<!-- <img src={qrsrc} /> -->

<!-- Here we go with some ridiculous grid layouts! -->

<div class="row">
  <div class="directions">
    <div class="infront">
      <button
        class="arrow vertical"
        disabled={$status !== 'READY'}
        on:click={() => {
          dapp.press(0);
        }}>
        ▲
      </button>
    </div>
    <div class="infront arrow-row">
      <button
        class="arrow horizontal"
        disabled={$status !== 'READY'}
        on:click={() => {
          dapp.press(2);
        }}>
        ◄
      </button>
      <button
        class="arrow horizontal"
        disabled={$status !== 'READY'}
        on:click={() => {
          dapp.press(3);
        }}>
        ►
      </button>
    </div>
    <div class="infront arrow-row">
      <button
        class="arrow vertical"
        disabled={$status !== 'READY'}
        on:click={() => {
          dapp.press(1);
        }}>
        ▼
      </button>
    </div>
  </div>
  <div class="actions">
    <button
      class="btn-b"
      disabled={$status !== 'READY'}
      on:click={() => {
        dapp.press(5);
      }}>
      B
    </button>
    <button
      class="btn-a"
      disabled={$status !== 'READY'}
      on:click={() => {
        dapp.press(4);
      }}>
      A
    </button>
  </div>
</div>
<div class="row system">
  <button
    disabled={$status !== 'READY'}
    on:click={() => {
      dapp.press(7);
    }}>
    Select
  </button>
  <button
    disabled={$status !== 'READY'}
    on:click={() => {
      dapp.press(6);
    }}>
    Start
  </button>
</div>
