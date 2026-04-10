"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface StacksContextType {
  userData: any;
  connectWallet: () => void;
  disconnectWallet: () => void;
  doCheckIn: () => Promise<void>;
  doPulse: () => Promise<void>;
  isConnected: boolean;
  isInitializing: boolean;
  isCheckingIn: boolean;
  isPulsing: boolean;
  showSuccess: boolean;
  pulseSuccess: boolean;
  pulseTxId: string | null;
  stxBalance: number | null;
}


const StacksContext = createContext<StacksContextType | undefined>(undefined);

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'a6ae799d0ee3f5904f558fce28f0abf5';

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pulseSuccess, setPulseSuccess] = useState(false);
  const [pulseTxId, setPulseTxId] = useState<string | null>(null);
  const [stxBalance, setStxBalance] = useState<number | null>(null);


  // Stored references for browser-only SDKs
  const [sdks, setSdks] = useState<{
    session: any;
    connect: any;
    tx: any;
    network: any;
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Dynamic imports to ensure BUILD node process never sees these
        const [Connect, AppKit, Transactions, Network] = await Promise.all([
          import("@stacks/connect"),
          import("@reown/appkit"),
          import("@stacks/transactions"),
          import("@stacks/network")
        ]);

        const appConfig = new Connect.AppConfig(["store_write", "publish_data"]);
        const session = new Connect.UserSession({ appConfig });

        setSdks({
          session,
          connect: Connect,
          tx: Transactions,
          network: Network
        });

        // Initialize Reown AppKit
        AppKit.createAppKit({
          projectId,
          networks: [{
            id: 'stacks:mainnet',
            name: 'Stacks',
            chainId: 1,
            currency: 'STX',
            explorerUrl: 'https://explorer.hiro.so',
            rpcUrl: 'https://api.mainnet.hiro.so'
          } as any],
          metadata: {
            name: 'Bitcoin-Native & Stacks-Aligned',
            description: 'Daily check-ins on Stacks',
            url: window.location.origin,
            icons: [`${window.location.origin}/favicon.ico`],
          },
        });

        // Sync session
        console.log("Checking session status...");
        if (session.isUserSignedIn()) {
          const data = session.loadUserData();
          console.log("User already signed in:", data.profile?.stxAddress?.mainnet);
          setUserData(data);
        } else if (session.isSignInPending()) {
          console.log("Sign-in pending, handling...");
          try {
            const data = await session.handlePendingSignIn();
            console.log("Sign-in successful after redirect:", data.profile?.stxAddress?.mainnet);
            setUserData(data);
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (error) {
            console.error("Failed to handle pending sign-in:", error);
          }
        }
      } catch (e) {
        console.error("SDK Initialization failed:", e);
      } finally {
        setIsInitializing(false);
      }
    };

    if (typeof window !== 'undefined') {
      init();
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined') return;
    
    console.log("Initiating wallet connection...");

    // First Priority: Try standard Stacks Connect if available
    if (sdks?.connect && sdks?.session) {
      console.log("Using Stacks Connect showConnect");
      sdks.connect.showConnect({
        appDetails: {
          name: 'Bitcoin-Native & Stacks-Aligned',
          icon: window.location.origin + '/favicon.ico',
        },
        userSession: sdks.session,
        onFinish: () => {
          console.log("showConnect onFinish triggered");
          // Multi-stage sync to handle immediate state transition + persistence
          setTimeout(() => {
            if (sdks.session.isUserSignedIn()) {
              const data = sdks.session.loadUserData();
              console.log("Session verified, address:", data.profile?.stxAddress?.mainnet);
              setUserData(data);
              // Small delay before reload to ensure user sees the "Connected" state (if transition is smooth)
              // or just reload immediately if that's more reliable.
              window.location.reload();
            } else {
              console.warn("onFinish called but session.isUserSignedIn() is false. Retrying sync...");
              // Fallback sync attempt
              const data = sdks.session.loadUserData();
              if (data) {
                setUserData(data);
                window.location.reload();
              }
            }
          }, 300);
        },
        onCancel: () => {
          console.log("Connection cancelled by user");
        }
      });
      return;
    }

    // Fallback: Use the custom SDK (e.g. for WalletConnect or special providers)
    console.log("Falling back to custom SDK connection");
    try {
      const { wallet } = await import("@earnwithalee/stacksrank-sdk");
      const address = await wallet.connectWallet();
      console.log("Custom SDK connection returned address:", address);
      
      if (address) {
        const manualUserData = {
          profile: {
            stxAddress: {
              mainnet: address,
              testnet: address
            }
          }
        };
        setUserData(manualUserData);
        console.log("Manual user data set for UI compatibility");
      }
    } catch (e) {
      console.error("Custom SDK Connection failed:", e);
    }
  };


  const disconnectWallet = () => {
    setUserData(null);
    if (sdks?.session) {
      sdks.session.signUserOut();
    }
    // Instead of full reload, just clear state. 
    // If needed, we can reload, but let's try to be smoother.
    // window.location.reload();
  };

  const doCheckIn = async () => {
    if (!userData) return;
    setIsCheckingIn(true);
    setShowSuccess(false);

    try {
      const { wallet } = await import("@earnwithalee/stacksrank-sdk");
      const { STACKS_CONTRACT_ADDRESS, STACKS_CONTRACT_NAME } = await import("@/config/constants");

      await wallet.callContract({
        contract: `${STACKS_CONTRACT_ADDRESS}.${STACKS_CONTRACT_NAME}`,
        functionName: "check-in",
        functionArgs: [],
        network: 'mainnet'
      });
      
      setIsCheckingIn(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Check-in error:", error);
      setIsCheckingIn(false);
    }
  };


  const doPulse = async () => {
    if (!userData) return;
    setIsPulsing(true);
    setPulseSuccess(false);

    try {
      const { wallet } = await import("@earnwithalee/stacksrank-sdk");
      const { STACKS_CONTRACT_ADDRESS, ENGAGEMENT_CONTRACT_NAME } = await import("@/config/constants");

      const tx: any = await wallet.callContract({
        contract: `${STACKS_CONTRACT_ADDRESS}.${ENGAGEMENT_CONTRACT_NAME}`,
        functionName: "pulse",
        functionArgs: [],
        network: 'mainnet'
      });

      setIsPulsing(false);
      setPulseSuccess(true);
      if (tx && tx.txId) setPulseTxId(tx.txId);
      setTimeout(() => {
        setPulseSuccess(false);
        setPulseTxId(null);
      }, 5000);
    } catch (error) {
      console.error("Pulse error:", error);
      setIsPulsing(false);
    }
  };

  // Sync balance using SDK
  useEffect(() => {
    const fetchBalance = async () => {
      if (userData?.profile?.stxAddress?.mainnet) {
        try {
          const { api } = await import("@earnwithalee/stacksrank-sdk");
          const balance = await api.getBalance(userData.profile.stxAddress.mainnet);
          setStxBalance(balance.stx);
        } catch (e) {
          console.error("Balance fetch error:", e);
        }
      }
    };
    fetchBalance();
  }, [userData]);


  return (
    <StacksContext.Provider
      value={{
        userData,
        connectWallet,
        disconnectWallet,
        doCheckIn,
        doPulse,
        isConnected: !!userData,
        isInitializing,
        isCheckingIn,
        isPulsing,
        showSuccess,
        pulseSuccess,
        pulseTxId,
        stxBalance
      }}

    >
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error("useStacks must be used within a StacksProvider");
  }
  return context;
}
