import React, { useCallback, useState, MouseEvent } from 'react';
import {ethers} from "ethers";
import './app.css';
import greeterAbi from '../../abi/contracts/Greeter.sol/Greeter.json';
declare let window: any;

function useInput() {
  const [value, setValue] = useState("");
  const input = <input value={value} onChange={e => setValue(e.target.value)} type="text" />;
  return [value, input];
}

function App() {
  const [connected, setConnected] = useState("no");
  const [ethBalance, setEthBalance] = useState("0");
  const [greet, setGreet] = useState("0");
  const [username, userInput] = useInput();

  const connect = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    const ethereum = window.ethereum as any;

    if (ethereum) {
      await ethereum.request({method: "eth_requestAccounts"})
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setEthBalance(ethers.utils.formatEther(await signer.getBalance()).toString())
      setConnected("yes")
    }
  },[])

  const handleClick = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    const ethereum = window.ethereum as any;

    if (ethereum) {
      const greeterAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"
      const provider = new ethers.providers.Web3Provider(ethereum);
    
      const contract = new ethers.Contract(greeterAddress, greeterAbi, provider);
      const value = await contract.greet();
      setGreet(value.toString())
    }
  },[])

  const setGreeting = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    const ethereum = window.ethereum as any;

    if (ethereum) {
      const greeterAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, greeterAbi, signer);
      const tx = await contract.setGreeting(username);
      console.log(username, tx)
    }
  },[username])
  
  
  return (
    <div className='App'>
      <h1>Bounties - Greeter</h1>
      <p>Vous avez {ethBalance} ETH sur votre compte</p>
      <br />
      <button onClick={connect}>Connect : {connected}</button>
      <button onClick={handleClick}>Bonjour</button>
      {userInput} - {username}
      <button onClick={setGreeting}>Set Greeting</button>
      <br />
      <br />
      <strong>Value: {greet}</strong>
    </div>
  );
}

export default App;