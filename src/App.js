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
const HOGWARTS_CONTRACT_ADDRESS = "";
const RANDOM_HOUSE_CONTRACT_ADDRESS = "";

function App() 
{
    return (
      <div className="App">
      </div>
    );
}  
    
export default App;
