"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface StacksContextType {
  userSession: any;
  userData: any;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isConnected: boolean;
  isInitializing: boolean;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'a6ae799d0ee3f5904f558fce28f0abf5';

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userSession, setUserSession] = useState<any>(null);
  const [stacksConnect, setStacksConnect] = useState<any>(null);

  useEffect(() => {
    // Only load browser dependencies on the client
    const init = async () => {
      try {
        // Dynamically import @stacks/connect to avoid SSR build errors
        const { AppConfig, UserSession, showConnect } = await import("@stacks/connect");
        const { createAppKit } = await import("@reown/appkit");

        const appConfig = new AppConfig(["store_write", "publish_data"]);
        const session = new UserSession({ appConfig });
        setUserSession(session);
        setStacksConnect({ showConnect });

        // Initialize Reown AppKit (Challenge Requirement)
        createAppKit({
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

        // Handle Session
        if (session.isUserSignedIn()) {
          setUserData(session.loadUserData());
        } else if (session.isSignInPending()) {
          session.handlePendingSignIn().then((data: any) => {
            setUserData(data);
          });
        }
      } catch (e) {
        console.error("Initialization error:", e);
      } finally {
        setIsInitializing(false);
      }
    };

    if (typeof window !== 'undefined') {
      init();
    }
  }, []);

  const connectWallet = () => {
    if (!stacksConnect || !userSession) {
      console.warn("Wallet system not ready");
      return;
    }

    stacksConnect.showConnect({
      appDetails: {
        name: 'Bitcoin-Native & Stacks-Aligned',
        icon: window.location.origin + '/favicon.ico',
      },
      userSession,
      onFinish: () => {
        const data = userSession.loadUserData();
        setUserData(data);
        window.location.reload();
      },
      onCancel: () => {
        console.log("Connect cancelled");
      },
    });
  };

  const disconnectWallet = () => {
    if (userSession) {
      userSession.signUserOut();
      setUserData(null);
      window.location.reload();
    }
  };

  return (
    <StacksContext.Provider
      value={{
        userSession,
        userData,
        connectWallet,
        disconnectWallet,
        isConnected: !!userData,
        isInitializing
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
