import * as React from 'react';
import Typography from 'material-ui/Typography';

export const gettingStartedAnswer1 = () => (
  <Typography variant="body2">
      Eth Plot is a pure decentralized game built on <a href="https://www.ethereum.org/">Ethereum.</a> With 
      Eth Plot, you can purchase a "plot" of space on a rectangular grid. When you purchase a plot, you get to 
      choose an image and an external web link fo that plot. The ownership and contents of the plot are stored 
      on the Ethereum blockchain - making the transaction irrevocable and giving you sole ownership of a unique
      digital item.
      <br/><br/>
      You can think of Eth Plot as decentralized version of <a href="https://www.reddit.com/r/place/">r/place</a>,
      a unique and fun social game created by Reddit. Eth Plot was inspired by this, but is fundamentally different due
      to the power of blockchain and smart contract technology - no single entity has control of Eth Plot, it will live on forever on the blockchain.
      Eth Plot is also different because you can upload full images and buy and sell plots.
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
      <li><Typography variant="body2">Ether, which is the currency used to run decentralized applications on Ethereum.  Purchasing a plot will require spending ether.</Typography></li>
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
    See <a href="https://metamask.io/">https://metamask.io/</a> for details and instructions on
    how to set up your wallet and fund your wallet with Ether.
  </Typography>
);

export const gettingStartedAnswer4 = () => (
  <Typography variant="body2">
    We built Eth Plot primarily to learn more about Ethereum DApp development.  After finishing it, we
    thought it would be something the Ethereum community would enjoy, so please let us know what you think!
    You can leave feedback on the Eth Plot GitHub repository (LINK TODO).
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
    <img style={imgStyle} src="../assets/placeholder.png" />
    <Typography variant="body2">
      A new panel will be shown, and will walk you through the following steps:
    </Typography>
    <ol>
      <li><Typography variant="body2">Choose the image you want to use for your plot.</Typography></li>
      <li><Typography variant="body2">Position and size the image by dragging it around on the Eth Plot window.  A heatmap will be displayed to help you find the cheapest locations.</Typography></li>
      <li><Typography variant="body2">You can optionally enter a website to associated with your plot.</Typography></li>
      <li><Typography variant="body2">You can optionally buyout price for your plot.  If you set a buyout price, other users will be able to purchase part or all of your plot - placing their image over your own.</Typography></li>
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
      the per pixel buyout price of your plot.  Setting this to 0 will take your plot off the market so
      that no one else will be able to buy any pixels of your plot.
    </Typography>
    <img style={imgStyle} src="../assets/placeholder.png" />
  </div>
);

export const gameplayAnswer4 = () => (
  <Typography variant="body2">
    There is a small fee when purchasing a plot through the Eth Plot UI (just 2%).  The UI is provided as a conenvience
    to users, but any user is more than welcome to interact directly with the Eth Plot smart contract and 
    avoid the fees entirely.  
  </Typography>
);

export const techDetailsAnswer1 = () => (
  <Typography variant="body2">
    There are a few components involved in Eth Plot.  There is a UI that is built With
    <a href="https://reactjs.org/">React</a> and <a href="https://material-ui-next.com/">Google's Material-UI library</a>.
    This gives end users an easier way to interact with the underlying smart contract.
    <br/><br/>
    The smart contract allows us to keep track of plot ownership, as well as the metadata associated
    with each plot - such as the URL and image hash for a given plot.  Because storing a full image on
    Ethereum would be prohibitively expensive, images are stored on <a href="https://www.ipfs.com/">IPFS</a> and only the hash of the
    image is stored on Ethereum.
  </Typography>
);

export const techDetailsAnswer2 = () => (
  <Typography variant="body2">
    Of course! Eth Plot is powered by a single smart contract here, you can see the code directly
    in a blockchain explorer like Etherscan here.  Or you can check out the contract on GitHub. TODO Links.
  </Typography>
);

export const techDetailsAnswer3 = () => (
  <Typography variant="body2">
    Eth Plot is deployed on the test net as well, you can interact with it here: LINK TODO.
  </Typography>
);