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
        if (session.isUserSignedIn()) {
          setUserData(session.loadUserData());
        } else if (session.isSignInPending()) {
          session.handlePendingSignIn().then((data) => {
            setUserData(data);
          });
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
    try {
      const { wallet } = await import("@earnwithalee/stacksrank-sdk");
      const address = await wallet.connectWallet();
      if (address) {
        // Sync with existing Connect session if needed, but SDK handles basic connection
        // For compatibility with rest of app, we still use Connect session if possible
        if (sdks?.session) {
           // Reloading as the SDK might use its own internal state management
           window.location.reload();
        }
      }
    } catch (e) {
      console.error("Connection failed:", e);
    }
  };


  const disconnectWallet = () => {
    if (sdks?.session) {
      sdks.session.signUserOut();
      setUserData(null);
      window.location.reload();
    }
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
