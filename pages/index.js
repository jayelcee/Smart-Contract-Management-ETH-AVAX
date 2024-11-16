import { useState, useEffect } from "react";
import { ethers } from "ethers";
import tokenWalletAbi from "../artifacts/contracts/TokenWallet.sol/TokenWallet.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [tokenWallet, setTokenWallet] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [contractBalance, setContractBalance] = useState(undefined);
  const [mintAmount, setMintAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientBalance, setRecipientBalance] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");

  const contractAddress = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";
  const tokenWalletABI = tokenWalletAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getTokenWalletContract();
  };

  const getTokenWalletContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const tokenWalletContract = new ethers.Contract(contractAddress, tokenWalletABI, signer);
    setTokenWallet(tokenWalletContract);
  };

  const getBalance = async () => {
    if (tokenWallet && account) {
      try {
        const balance = await tokenWallet.balanceOf(account);
        console.log("User balance: ", balance.toString());
        setBalance(ethers.utils.formatUnits(balance, 18));
      } catch (error) {
        console.error("Error fetching balance: ", error);
      }
    }
  };

  const getContractBalance = async () => {
    if (tokenWallet) {
      try {
        const balance = await tokenWallet.getBalance();
        console.log("Contract balance: ", balance.toString());
        setContractBalance(ethers.utils.formatUnits(balance, 18));
      } catch (error) {
        console.error("Error fetching contract balance: ", error);
      }
    }
  };

  const getRecipientBalance = async (address) => {
    if (tokenWallet) {
      try {
        const balance = await tokenWallet.balanceOf(address);
        console.log("Recipient balance: ", balance.toString());
        setRecipientBalance(ethers.utils.formatUnits(balance, 18));
      } catch (error) {
        console.error("Error fetching recipient balance: ", error);
      }
    }
  };

  const mintTokens = async () => {
    if (tokenWallet && account) {
      try {
        console.log("Minting tokens: ", mintAmount);
        const tx = await tokenWallet.mintTokens(ethers.utils.parseUnits(mintAmount, 18));
        console.log("Transaction: ", tx);
        await tx.wait();
        console.log("Tokens minted");
        getBalance();
        getContractBalance();
      } catch (error) {
        console.error("Error minting tokens: ", error);
        setErrorMessage("Error minting tokens: " + error.message);
      }
    }
  };

  const transferTokens = async () => {
    if (tokenWallet && account) {
      try {
        if (!ethers.utils.isAddress(transferTo)) {
          alert("Invalid recipient address");
          return;
        }
        console.log("Transferring tokens: ", transferAmount, " to ", transferTo);
        const tx = await tokenWallet.transferTokens(transferTo, ethers.utils.parseUnits(transferAmount, 18));
        console.log("Transaction: ", tx);
        await tx.wait();
        console.log("Tokens transferred");
        getBalance();
        getRecipientBalance(transferTo);
      } catch (error) {
        console.error("Error transferring tokens: ", error);
        if (error.message.includes("Insufficient balance")) {
          setErrorMessage("Insufficient balance");
        } else {
          setErrorMessage("Error transferring tokens: " + error.message);
        }
      }
    }
  };

  const resetAll = async () => {
    if (tokenWallet && account) {
      try {
        console.log("Resetting balance");
        const tx = await tokenWallet.resetBalance();
        console.log("Transaction: ", tx);
        await tx.wait();
        console.log("Balance reset");
        getBalance();
        getContractBalance();
        setRecipientBalance(undefined); // Reset recipient balance
        setMintAmount(""); // Reset mint amount input
        setTransferTo(""); // Reset transfer to input
        setTransferAmount(""); // Reset transfer amount input
        setErrorMessage(""); // Clear error message
      } catch (error) {
        console.error("Error resetting balance: ", error);
        setErrorMessage("Error resetting balance: " + error.message);
      }
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (tokenWallet && account) {
      getBalance();
      getContractBalance();
    }
  }, [tokenWallet, account]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "20px" }}>
      <h1 style={{ color: "#333", marginBottom: "20px", marginTop: "120px" }}>Welcome to the Token Wallet!</h1>
      {!account && <button onClick={connectAccount} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>Connect MetaMask</button>}
      {account && (
        <div style={{ textAlign: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", marginTop: "15px" }}>
          <p>Account: {account}</p>
          <p>Contract Balance: {contractBalance ? `${contractBalance} Tokens` : "Loading..."} </p>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Amount to Mint"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              style={{ padding: "10px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button onClick={mintTokens} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>Mint Tokens</button>
          </div>
          <p>Account Balance: {balance ? `${balance} Tokens` : "Loading..."} </p>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Recipient Address"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              style={{ padding: "10px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="text"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              style={{ padding: "10px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button onClick={transferTokens} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>Transfer Tokens</button>
            {recipientBalance !== undefined && (
              <p>Recipient Balance: {recipientBalance} Tokens</p>
            )}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
          <div>
            <button onClick={resetAll} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>Reset All</button>
          </div>
        </div>
      )}
    </div>
  );
}