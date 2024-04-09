

function useEthereum() {
    const [currentAccount, setCurrentAccount] = useState(null);
  
    useEffect(() => {
      async function checkIfWalletIsConnected() {
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              setCurrentAccount(accounts[0]);
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
  
      checkIfWalletIsConnected();
    }, []);
  
    const requestAccount = async () => {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(account);
    };
  
    return { currentAccount, requestAccount };
  }