"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface StacksContextType {
  userData: any;
  connectWallet: () => void;
  disconnectWallet: () => void;
  doCheckIn: () => Promise<void>;
  isConnected: boolean;
  isInitializing: boolean;
  isCheckingIn: boolean;
  showSuccess: boolean;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'a6ae799d0ee3f5904f558fce28f0abf5';

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const connectWallet = () => {
    if (!sdks) return;
    sdks.connect.showConnect({
      appDetails: {
        name: 'Bitcoin-Native & Stacks-Aligned',
        icon: window.location.origin + '/favicon.ico',
      },
      userSession: sdks.session,
      onFinish: () => {
        setUserData(sdks.session.loadUserData());
        window.location.reload();
      },
    });
  };

  const disconnectWallet = () => {
    if (sdks?.session) {
      sdks.session.signUserOut();
      setUserData(null);
      window.location.reload();
    }
  };

  const doCheckIn = async () => {
    if (!sdks || !userData) return;
    setIsCheckingIn(true);
    setShowSuccess(false);

    try {
      const network = sdks.network.STACKS_MAINNET;
      const stxAddress = userData.profile.stxAddress.mainnet;
      const amount = 10000; // 0.01 STX

      // Prepare post-condition
      const postConditions = [
        sdks.tx.Pc.principal(stxAddress).willSendEq(amount).ustx()
      ];

      await sdks.connect.openContractCall({
        network,
        contractAddress: "SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT",
        contractName: "check-in",
        functionName: "check-in",
        functionArgs: [],
        postConditionMode: sdks.tx.PostConditionMode.Allow,
        postConditions,
        onFinish: (data: any) => {
          console.log("Tx Sent:", data.txId);
          setIsCheckingIn(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
        },
        onCancel: () => {
          setIsCheckingIn(false);
        },
      });
    } catch (error) {
      console.error("Check-in error:", error);
      setIsCheckingIn(false);
    }
  };

  return (
    <StacksContext.Provider
      value={{
        userData,
        connectWallet,
        disconnectWallet,
        doCheckIn,
        isConnected: !!userData,
        isInitializing,
        isCheckingIn,
        showSuccess
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
