import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useEthereum = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkIfWalletIsConnected = async () => {
            const { ethereum } = window;
            if (!ethereum) {
                console.error("Ethereum object not found");
                return;
            }
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                setIsConnected(true);
            }
        };
        checkIfWalletIsConnected();
    }, []);

    const requestAccount = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.error("Ethereum object not found");
            return;
        }
        const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(account);
        setIsConnected(true);
    };

    return { currentAccount, isConnected, requestAccount, setIsConnected };
};
