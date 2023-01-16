import React from "react";
import { useEffect, useState } from "react";
import {
  PandaContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
  approveAmt, 
  tokenTransfer,
  allowanceTransfer
} from "./util/interact.js";

import alchemylogo from "./alchemylogo.svg";

const Panda = () => {
  //state variables
  const contract_owner = "0x7a6586830eB47F53FA2F66E538d51aCc1B10FeB8" // my second wallet for testing purposes
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage, setNewMessage] = useState("");
  const [myBalance, setMyBalance] = useState(0);
  const [approveTokenAmt, setApproveTokenAmt] = useState(0);
  const [transferTokenAmt, setTransferTokenAmt] = useState(0);
  const [transferAllowanceAmt, setTransferAllowanceAmt] = useState(0);
  const [receiverWallet, setReceiverWallet] = useState('');
  const [fromWallet, setFromWallet] = useState('');
  const [toWallet, setToWallet] = useState('');
  const [approvedWalletAddress, setApprovedWalletAdress] = useState('')


  //called only once
  useEffect(async () => {
    const message = await loadCurrentMessage();
    setMessage(message);
    addSmartContractListener();

    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addWalletListener();
    getMyBalance();


  }, [walletAddress]);

  function addSmartContractListener() {
    PandaContract.events.UpdatedMessages({}, (error, data) => {
      if (error) {
        setStatus("😥 " + error.message);
      } else {
        setMessage(data.returnValues[1]);
        setNewMessage("");
        setStatus("🎉 Your message has been updated!");
      }
    });
    PandaContract.events.Transfer({}, (error, data) => {
      if (error) {
        setStatus("😥 " + error.message);
      } else {
        setMessage(data.returnValues[1]);
        setNewMessage("");
        setStatus("🎉 Your transfer has been done!");
      }
    });
  }

  function addWalletListener() { 
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, newMessage);
    setStatus(status);
  };

  const onApprovePressed = async () => {
    const { status } = await approveAmt(walletAddress, contract_owner, approveTokenAmt)
    setStatus(status)
    
  };


  const totalSupplyPressed = async () => {
    const test = await PandaContract.methods.totalSupply().call()
    console.log(test)
  }

  const getMyBalance = async () => {
    if(walletAddress){
      const balance = await PandaContract.methods.balanceOf(walletAddress).call()
      setMyBalance(balance)
    }
  }
  const getAllowance = async () => {
    if(walletAddress && approvedWalletAddress){
      const allowance = await PandaContract.methods.allowance(walletAddress, approvedWalletAddress).call()
      console.log(approvedWalletAddress, ': ', allowance, ' PAN')
    }
  }

  const transferTokens = async () => {
    const { status } = await tokenTransfer(walletAddress, receiverWallet, transferTokenAmt);
    setStatus(status)
  }

  const transferAllowance = async () => {
    const { status } = await allowanceTransfer(walletAddress, fromWallet, toWallet, transferAllowanceAmt);
    setStatus(status)
  }

  //the UI of our component
  return (
    <div id="container">
      <img id="logo" src={alchemylogo}></img>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>

        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
      </div>
      <div>
        <button onClick={totalSupplyPressed}>
          Total Supply
        </button>
      </div>
      <div>
        My Panda Token Balance: {myBalance}
      </div>
      <div>
        <div>
          Please input how many tokens you want Panda Bank to handle for you
        </div>
        <input
        type='number'
        onChange={(e) => setApproveTokenAmt(e.target.value)}
        />
        <button onClick={onApprovePressed}>
          Approve
        </button>
      </div>
      <div>
        Transfer tokens
        <br/>
        <input
        type="text"
        placeholder="Receiver wallet address"
        onChange={(e) => setReceiverWallet(e.target.value)}
        />
        <input
        type="number"
        placeholder="number of tokens to transfer"
        onChange={(e) => setTransferTokenAmt(e.target.value)}
        />
        <button onClick={transferTokens}>
          Confirm Transaction
        </button>
      </div>
      <div>
        Find allowance
        <br/>
        <input
        type='text'
        placeholder='input wallet address'
        onChange={(e) => setApprovedWalletAdress(e.target.value)}
        />
        <button onClick={getAllowance}>
          Search
        </button>
      </div>
      <div>
        Transfer allowance
        <br/>
        <input
        type='text'
        placeholder='input owner wallet address'
        onChange={(e) => setFromWallet(e.target.value)}
        />
        <input
        type='text'
        placeholder='input receiver wallet address'
        onChange={(e) => setToWallet(e.target.value)}
        />
        <input
        type='number'
        placeholder='input number of tokens to transfer'
        onChange={(e) => setTransferAllowanceAmt(e.target.value)}
        />
        <button onClick={transferAllowance}>
          Transfer funds
        </button>
      </div>
    </div>
  );
};

export default Panda;
