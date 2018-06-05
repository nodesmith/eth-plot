import Typography from 'material-ui/Typography';
import * as React from 'react';

// tslint:disable:max-line-length

export const gettingStartedAnswer1 = () => (
  <Typography variant="body2">
      Eth Plot is a decentralized game built on <a href="https://www.ethereum.org/">Ethereum</a>. With 
      Eth Plot, you can purchase a "plot" of digital space on a square grid. When you purchase a plot, 
      you get to place an image on that plot.  You also get to associate your plot with a website of your choosing.
      
      <br/><br/>
      Plots are bought and sold using transactions on Ethereum, so you can rest assured that plot ownership 
      is transparent, irreversible, and not controlled by us.  Your plot is unique and forever yours!
      Unless you decide to sell it.  You can choose to sell your plot at any time, and at 
      whatever price you choose.  If someone buys your plot, you will receive the proceeds.
  </Typography>
);

export const gettingStartedAnswer2 = () => (
  <div>
    <Typography variant="body2">
      There are a few things you'll need to get started with Eth Plot.
    </Typography>
    <ul>
      <li><Typography variant="body2">A computer or laptop with one of the following browsers: Chrome, Firefox, or Brave.</Typography></li>
      <li><Typography variant="body2">MetaMask, which is a digital wallet extension that allows you to interact with DApps.</Typography></li>
      <li>
        <Typography variant="body2">
          Ether, which is the currency used to run decentralized applications on Ethereum.  Purchasing a plot will require spending ether.
        </Typography>
      </li>
    </ul>
  </div>
);

export const gettingStartedAnswer3 = () => (
  <Typography variant="body2">
    In order to use Eth Plot, you will need to install MetaMask.  MetaMask is a browser 
    extension that serves as a digital wallet.  Once MetaMask has been installed, you will need
    to fund your wallet with Ether, the digital currency that is used to power decentralized
    applications on Ethereum - and also what will be used to purchase a plot.  You can 
    send Ether you already own directly to your MetaMask account or purchase Ether directly through
    MetaMask with their convenient Coinbase integration.

    <br/><br/>
    <a href={'https://metamask.io'} target="_blank">
      <img style={ imgStyle } src={'../assets/metamasklogo.png'} />
    </a>
  </Typography>
);

export const gettingStartedAnswer4 = () => (
  <Typography variant="body2">
    We built Eth Plot primarily to learn more about Ethereum DApp development.  We learned a good deal in the 
    process and wanted to share what we've built with the Ethereum community.
    
    <br /><br />
    We wrote an <a href="https://medium.com/@brendan_87166/what-we-learned-building-our-first-dapp-28b01f9fc244">article</a> that
    summarizes what we learned during the process. We have also open sourced all the code we used to
    build this application. Check it out at our <a href="https://github.com/space-dust-blockchain/eth-plot">GitHub</a> repository
    and leave us any feedback you have.
  </Typography>
);

const imgStyle: React.CSSProperties = {
  width: '100%',
  padding: 8
};

export const gameplayAnswer1 = () => (
  <div>
    <Typography variant="body2">
      To purchase a plot, you will first need to be signed in to your MetaMask account.  
      Then, navigate to the home page of Eth Plot and click the purchase button, shown below:
    </Typography>
    <img style={imgStyle} src="../assets/buyFlow.png" />
    <Typography variant="body2">
      A side pane will appear and walk you through the following steps:
    </Typography>
    <ol>
      <li><Typography variant="body2">Choose the image you want to use for your plot.</Typography></li>
      <li>
        <Typography variant="body2">
          Position and size the image by dragging it around on the Eth Plot window.  
          A heatmap will be displayed to help you find the cheapest locations.
        </Typography>
      </li>
      <li><Typography variant="body2">You can optionally enter a website to associate with your plot.</Typography></li>
      <li>
        <Typography variant="body2">
          You can optionally set a buyout price for your plot.  If you set a buyout price, 
          other users will be able to purchase part or all of your plot - placing their image over your own.
        </Typography>
      </li>
      <li><Typography variant="body2">Review the information and submit a transaction via MetaMask to finalize the purchase.</Typography></li>
    </ol>
  </div>
);

export const gameplayAnswer2 = () => (
  <Typography variant="body2">
    When you purchase a plot, you have the option to set a "buyout price" for your plot.
    Your plot will always be rectangular, and by owning a plot you own every pixel within that
    rectangle.  When you set a buyout, you are setting a buyout price for each pixel within your plot.
    If your plot has a buyout price set, then any pixel can be sold to any user who chooses
    to purchase a plot that overlaps with any of your owned pixels. This means that your plot will 
    typically be sold piece by piece.
    <br /><br />
    Whenever you sell a portion of a plot, the account with which you purchased the plot will automatically
    receive the Ether you are due from the sale of your plot.
  </Typography>
);

export const gameplayAnswer3 = () => (
  <div>
    <Typography variant="body2">
      You can update the buyout price of your plot at any time by visiting the "My Plots" page.
      On that page you will see a list of plots that you own.  Click on "Edit Buyout" to change
      the per pixel buyout price of your plot.  Clicking the "Update Buyout" button will create a transaction
      that updates the buyout price of your plot; clicking the "Cancel Plot Sale" button will take
      your plot off the market.
    </Typography>
    <img style={imgStyle} src="../assets/updateFlow.png" />
  </div>
);

export const gameplayAnswer4 = () => (
  <Typography variant="body2">
    We take a 1% fee on any transaction that goes through our website.  For reference, CryptoKitties is about
    3.75 times as expensive.  We set this price after doing extensive research and determining that CryptoKitties is
    about 3.75 times cooler than Eth Plot. 

    <br /><br /> 
    You can skip this fee by interacting with the Eth Plot smart contract directly.  
  </Typography>
);

export const gameplayAnswer5 = () => (
  <Typography variant="body2">
    If illegal images are uploaded to Eth Plot, we will add a flag to the smart contract for that specific plot.  That flag
    tells us to not render that image in our UI.  This does not remove the image from the Eth Plot contract, it merely restricts
    that content from being shown in our UI and would allow us to comply with any takedown requests.  Anyone is free
    to fork our project and host a version of Eth Plot that does not censor any content.  We will not censor any content other
    than what is deemed illegal in the United States.
  </Typography>
);

export const techDetailsAnswer1 = () => (
  <Typography variant="body2">
    The UI for Eth Plot is build with <a href="https://reactjs.org/">React</a> and the <a href="https://material-ui-next.com/">Material-UI library</a>.
    This gives end users an easier way to interact with the underlying smart contract.
    <br /><br />
    The smart contract allows us to keep track of plot ownership, as well as the metadata associated
    with each plot - such as the URL and image hash for a given plot.  Because storing a full image on
    Ethereum would be prohibitively expensive, images are stored on <a href="https://www.ipfs.com/">IPFS</a> and only the hash of the
    image is stored on Ethereum.  The smart contract itself is well documented and discusses our 
    approach to data storage, which is challenging given this use case and the EVM restrictions.

    <br /><br />
    We have much more technical detail in the accompanying <a href="https://medium.com/@brendan_87166/what-we-learned-building-our-first-dapp-28b01f9fc244">blog post</a> that
    details what we learned about Ethereum development while building Eth Plot.
  </Typography>
);

export const techDetailsAnswer2 = () => (
  <Typography variant="body2">
    Of course! You can check out the contract here: <a href="https://github.com/space-dust-blockchain/eth-plot/blob/master/contracts/EthGrid.sol">GitHub</a>.
  </Typography>
);

export const techDetailsAnswer3 = () => (
  <Typography variant="body2">
    Yes! You are welcome to use any of the test net versions of Eth Plot.
    Eth Plot is deployed on all the major test nets - Ropsten, Rinkeby and Kovan.  Simply change the network that your MetaMask extension
    is connected to, and you will be able to interact with the version of Eth Plot on the network you selected.
  </Typography>
);
