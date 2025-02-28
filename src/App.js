import React, { useState, useEffect } from "react";
import useSound from 'use-sound';
import Web3 from "web3";
import Lottie from "lottie-react";

// Import contract artifacts
// Import contract ABIs
import HogwartsNFTArtifact from "./artifacts/HogwartsNFT.json"; 
import RandomHouseAssignmentArtifact from "./artifacts/RandomHouseAssignment.json"; 

// Import assets
import HogwartsLogo from "./assets/hogwarts_logo.png";
import HPLoader from "./loaders/hpLoader.json"

// Import audio files
import gryffindorSound from "./sounds/gryffindor.mp3";
import hufflepuffSound from "./sounds/hufflepuff.mp3";
import ravenclawSound from "./sounds/ravenclaw.mp3";
import slytherinSound from "./sounds/slytherin.mp3";
import thinkingSound from "./sounds/thinking.mp3"; 
import bgSound from "./sounds/bg_music.mp3";

// Import styles
import "./App.css";

// Paste your Contract addresses that Deployed on Arbitrum Sepolia Testnet
const HOGWARTS_CONTRACT_ADDRESS = "0xD1aa5e27bE1A0Fd30363C464F1d6DCE03229eD16";
const RANDOM_HOUSE_CONTRACT_ADDRESS = "0x1004cA1392475253fc94ff0f963cABd76CE31B5c";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [hogwartsContract, setHogwartsContract] = useState(null);
  const [randomHouseContract, setRandomHouseContract] = useState(null);  
  const [house, setHouse] = useState("");
  const [house_slogan, sethouseSlogan] = useState("");
  const [minted, setMinted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [checkMintedSuccess, setCheckMintSuccess] = useState(0);
  const [counter, setCounter] = useState(60);
  const [displayCounter, setDisplayCounter] = useState(false);
  const [started, setStarted] = useState(false);
  const [userName, setUserName] = useState("");
  const [isUserNameSubmitted, setIsUserNameSubmitted] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);

  //initialize audio
  const [playBgSound, { stop: stopBgSound }] = useSound(bgSound, { loop: true });
  const [playThinkingSound] = useSound(thinkingSound, { loop: false });
  const [playGryffindorSound] = useSound(gryffindorSound, { loop: false });
  const [playHufflepuffSound] = useSound(hufflepuffSound, { loop: false });
  const [playRavenclawSound] = useSound(ravenclawSound, { loop: false });
  const [playSlytherinSound] = useSound(slytherinSound, { loop: false });


  const defaultLoadingMessage = "Ah, right then... hmm... right";
  const dynamicLoadingMessage = `Ahh seems difficult, let me think harder, wait for ${counter} seconds`;
  
  // Play background music when app starts
  useEffect(() => {
    if (started) {
      console.log('Starting background music');
      playBgSound();
      return () => {
        console.log('Stopping background music');
        stopBgSound();
      };
    }
  }, [started, playBgSound, stopBgSound]);

  useEffect(() => {
    if(started && window.ethereum) {
      checkNetwork();
      
      window.ethereum.on("networkChanged", checkNetwork);
      
      return () => {
        window.ethereum.removeListener("networkChanged", checkNetwork);
      }
    }
  }, [started]);

  useEffect(() => {
    const connectToMetaMask = async () => {
      if (!started) return;

      try {
        if (typeof window.ethereum === 'undefined') {
          alert("Please install MetaMask to use this app!");
          return;
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize Web3 instance
        const web3Instance = new Web3(window.ethereum);
        
        // Initialize contract instances
        const hogwartsInstance = new web3Instance.eth.Contract(
          HogwartsNFTArtifact,
          HOGWARTS_CONTRACT_ADDRESS
        );
        
        const randomHouseInstance = new web3Instance.eth.Contract(
          RandomHouseAssignmentArtifact,
          RANDOM_HOUSE_CONTRACT_ADDRESS
        );

        // Setup event listeners
        window.ethereum.on("accountsChanged", (newAccounts) => {
          setAccount(newAccounts[0]);
          setConnected(true);
        });

        window.ethereum.on("disconnect", () => {
          setAccount("");
          setConnected(false);
          setMinted(false);
        });

        // Update state
        setAccount(accounts[0]);
        setWeb3(web3Instance);
        setHogwartsContract(hogwartsInstance);
        setRandomHouseContract(randomHouseInstance);
        setConnected(true);

        // Check if user has already minted
        await checkMinted();

        console.log("Connected Account =",accounts[0]);
      } 
      catch (error) 
      {
        console.error("Error connecting to MetaMask:", error);
        alert("Error connecting to MetaMask. Please make sure it's installed and try again.");
      }

    };

    connectToMetaMask();
  }, [started]);

  useEffect(() => {
    if (started && hogwartsContract && randomHouseContract && account) {
      checkMinted();
    }
  }, [hogwartsContract, randomHouseContract, account, started]);

  // Play house sound when house is set
  useEffect(() => {
    if (house) {
      // Extract house number from the text
      if (house.includes('Gryffindor')) {
        playGryffindorSound();
      } else if (house.includes('Hufflepuff')) {
        playHufflepuffSound();
      } else if (house.includes('Ravenclaw')) {
        playRavenclawSound();
      } else if (house.includes('Slytherin')) {
        playSlytherinSound();
      }
      console.log('Playing sound for house:', house);
    }
  }, [house, playGryffindorSound, playHufflepuffSound, playRavenclawSound, playSlytherinSound]);

  const disconnectMetamask = async () => {
    try {
      await window.ethereum.enable();
      setConnected(false);
      setAccount("");
      setHouse("");
      sethouseSlogan("");
      stopBgSound();
      setStarted(false);
      setIsUserNameSubmitted(false);
      setUserName("");
    } catch (err) {
      console.error(err);
    }
  };

  const checkNetwork = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const networkId = await window.ethereum.request({ method: 'net_version' });

      if(networkId === '421614') {
        setStarted(true);
        playBgSound(); 
        setResponseLoading(true);
        
        // Initialize Web3 and contracts after network check
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        
        const hogwartsInstance = new web3Instance.eth.Contract(
          HogwartsNFTArtifact,
          HOGWARTS_CONTRACT_ADDRESS
        );
        
        const randomHouseInstance = new web3Instance.eth.Contract(
          RandomHouseAssignmentArtifact,
          RANDOM_HOUSE_CONTRACT_ADDRESS
        );

        setAccount(accounts[0]);
        setWeb3(web3Instance);
        setHogwartsContract(hogwartsInstance);
        setRandomHouseContract(randomHouseInstance);
        setConnected(true);
        
        // Check if user has already minted
        await checkMinted();
      } else {
        alert("Please connect to Arbitrum Sepolia Testnet"); 
      }
    } catch (error) {
      console.error("Error in checkNetwork:", error);
      alert("Error connecting to the network. Please make sure MetaMask is installed and connected.");
      setResponseLoading(false);
    }
  }
  

  console.log(house);
  const connectMetamask = async () => {
    try {
      await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      setConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const requestNFT = () => {
    if (!userName) {
      alert("Please enter your name first!");
      return;
    }

    setLoading(true);
    playThinkingSound();

    randomHouseContract.methods
      .requestNFT(userName)
      .send({ from: account, value: web3.utils.toWei("0", "ether") })
      .on("transactionHash", function (hash) {
        console.log("Transaction sent. Transaction hash:", hash);
        setDisplayCounter(true);
      })
      .on("receipt", async function (receipt) {
        console.log("Transaction successful:", receipt.transactionHash);
        try {
          console.log('Starting NFT minting process...');
          
          // Initial delay to allow transaction to propagate
          await new Promise(resolve => setTimeout(resolve, 8000));
          
          let retries = 0;
          const maxRetries = 10;
          
          while (retries < maxRetries) {
            console.log(`Checking NFT status (attempt ${retries + 1}/${maxRetries})...`);
            
            try {
              // Check HogwartsNFT contract for minted status
              const minted = await hogwartsContract.methods.hasMintedNFT(account).call();
              console.log('Hogwarts NFT minted status:', minted);
              
              if (minted) {
                console.log('NFT minted successfully!');
                setMinted(true);
                
                // Get house data with retries
                let houseRetries = 0;
                while (houseRetries < 3) {
                  try {
                    console.log('Getting house data...');
                    const houseIndex = await hogwartsContract.methods.getHouseIndex(account).call();
                    console.log('House index:', houseIndex);
                    await getHouseData();
                    console.log('Getting name data...');
                    await checkName();
                    break;
                  } catch (err) {
                    console.error('Error getting house data, retrying...', err);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    houseRetries++;
                  }
                }
                break;
              }
              
              console.log(`NFT not ready yet, waiting 8 seconds... (attempt ${retries + 1}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, 8000));
              retries++;
              
            } catch (err) {
              console.error('Error checking NFT status:', err);
              await new Promise(resolve => setTimeout(resolve, 5000));
              retries++;
            }
          }
          
          if (retries >= maxRetries) {
            console.log('Max retries reached. Transaction was successful but NFT minting is taking longer than expected.');
            console.log('Please check your NFT status in a few minutes.');
            console.log('Transaction URL:', `https://sepolia.arbiscan.io/tx/${receipt.transactionHash}`);
          }
        } catch (error) {
          console.error('Error in minting process:', error);
        } finally {
          setLoading(false);
          setDisplayCounter(false);
        }
      })
      .on("error", (error) => {
        console.error("Error requesting NFT:", error);
        setLoading(false);
        setDisplayCounter(false);
        alert("Error minting NFT. Please try again.");
      });
};
  
  //function to get the house of the contract
  const getHouseData = async () => {
    setLoading(true);
    const houseIndex = await hogwartsContract.methods.getHouseIndex(account).call();
    const addressToHouse = [
    "You belong in Gryffindor....", 
    "You belong in Hufflepuff....", 
    "You belong in wise old Ravenclaw....", 
    "You belong perhaps in Slytherin...."];
    setHouse(addressToHouse[houseIndex]);

    const sloganToHouse = [ 
      "Where dwell the brave at heart. Their daring, nerve, and chivalry, Set Gryffindors apart.",    
      "Where they are just and loyal. Those patient Hufflepuffs are true And unafraid of toil.",    
      "you’ve a ready mind. Where those of wit and learning, Will always find their kind.",    
      "You’ll make your real friends. Those cunning folks use any means, To achieve their ends."  ];      
    sethouseSlogan(sloganToHouse[houseIndex]);

    // No need to play sound here as it will be handled by the useEffect
    setLoading(false);
  };

  // function to check if the user has minted an NFT
  const checkMinted = async () => {
    try {
      if (!hogwartsContract || !account) return;
      
      await checkName();
      const minted = await hogwartsContract.methods.hasMintedNFT(account).call();
      console.log(minted);
      if (minted === true) {
        setMinted(true);
        await getHouseData();
      } else {
        setMinted(false);
      }
    } catch (error) {
      console.error("Error checking minted status:", error);
    } finally {
      setLoading(false);
      setResponseLoading(false);
    }
 
  };

  console.log(userName);
  const checkName = async () => {
    try {
      if (!hogwartsContract || !account) return;
      
      setLoading(true);
      const name = await hogwartsContract.methods.s_addressToName(account).call();
      if (name) {
        setUserName(name);
        setIsUserNameSubmitted(true);
      }
      console.log("name set");    
    } catch (error) {
      console.error("Error checking name:", error);
    } finally {
      setLoading(false);
    }
  };

  // function to check if the user has minted an NFT
  const checkNewMinted = async () => {
    try {
      const minted = await hogwartsContract.methods.hasMintedNFT(account).call();
      if (minted) {
        setMinted(true);
        await getHouseData();
        await checkName();
        setLoading(false);
        setDisplayCounter(false);
      }
    } catch (error) {
      console.error("Error checking minted status:", error);
      setLoading(false);
      setDisplayCounter(false);
    }
    };
    
    const showNameField = ()=>(
      <div className="form">
        <input className="input-box"
          type="text" 
          placeholder="Enter your name" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)}
          />
        <button className="form-button" onClick={() => {setUserName(userName); setIsUserNameSubmitted(true);}}>Submit</button>
      </div>)

    const startButton = ()=>(
      <button className="start-button" onClick={() => {
        setStarted(true);
        checkNetwork();
      }}>
      Let's go to the Great Hall
      </button>)

    const mintedView = ()=> (
        <>
          {loading || !house ? (
            <p>{displayCounter ? (counter ? dynamicLoadingMessage : defaultLoadingMessage) : defaultLoadingMessage}</p>
          ) : (
            <>
              <p>{house}</p>
              {house_slogan.split('. ').map((slogan, index) => (
                <p key={index}>{slogan}</p>
              ))}
            </>
          )}
        </>
      
    )

    const mintNFT = () => (
      
        <>
          {!userName || !isUserNameSubmitted ? showNameField() :
          !loading ? <button onClick={requestNFT} disabled={minted}>Let's choose your house</button> : <p className="loading-button-msg">{displayCounter ? (counter ? dynamicLoadingMessage : defaultLoadingMessage) : defaultLoadingMessage}</p>
          }
        </>
      
    )

    const style = {
      height: 250,
    };

    const connectedView = ()=> (
      <>
         {responseLoading ? <Lottie animationData={HPLoader} style={style} loop={true} /> : minted ? mintedView() : mintNFT()}
      <button className="metamask-button" onClick={disconnectMetamask}> disconnect wallet </button>
      </>
    )

    const gameStarted = ()=>(
      <>
      {  
        connected ? connectedView () : <button className="metamask-button" onClick={connectMetamask}> connect wallet </button>
      }    
      </>
    )

    return (
      <div className="App">
        <img className="Hogwarts-logo" src={HogwartsLogo} alt="Hogwarts Logo" />
        <h1>Welcome to Hogwarts {userName}</h1>
        
        {started ? gameStarted() : startButton()}
      </div>
    );
}  
    
export default App;
