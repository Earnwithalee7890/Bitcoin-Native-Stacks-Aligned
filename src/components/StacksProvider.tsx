"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { useToast } from "./ui/ToastProvider";

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
  txStatus: "idle" | "pending" | "success" | "failed";
  lastTxId: string | null;
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
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const { toast } = useToast();

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

  const pollTxStatus = useCallback(async (txId: string) => {
    setTxStatus("pending");
    setLastTxId(txId);
    toast({ title: "Transaction Broadcasted", description: "Monitoring status on-chain...", variant: "loading" });

    const check = async (): Promise<"success" | "pending" | "failed" | "dropped"> => {
      try {
        const { HIRO_API_BASE } = await import("@/config/constants");
        const res = await fetch(`${HIRO_API_BASE}/extended/v1/tx/${txId}`);
        if (!res.ok) return "pending";
        const data: any = await res.json();
        return data.tx_status;
      } catch (e) {
        return "pending";
      }
    };

    const interval = setInterval(async () => {
      const status = await check();
      if (status === "success") {
        setTxStatus("success");
        toast({ title: "Transaction Confirmed", description: "Action successful!", variant: "success" });
        clearInterval(interval);
        setTimeout(() => setTxStatus("idle"), 10000);
      } else if (status === "failed" || status === "dropped") {
        setTxStatus("failed");
        toast({ title: "Transaction Failed", description: `Status: ${status}`, variant: "error" });
        clearInterval(interval);
        setTimeout(() => setTxStatus("idle"), 10000);
      }
    }, 10000);
  }, [toast]);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      const { wallet } = await import("@earnwithalee/stacksrank-sdk");
      const address = await wallet.connectWallet();
      if (address) {
        if (sdks?.session) {
           window.location.reload();
        }
        toast({ title: "Wallet Connected", description: "Successfully authenticated with Stacks.", variant: "success" });
      }
    } catch (e) {
      console.error("Connection failed:", e);
      toast({ title: "Connection Failed", variant: "error" });
    }
  }, [sdks, toast]);

  const disconnectWallet = useCallback(() => {
    if (!sdks) return;
    sdks.session.signUserOut();
    setUserData(null);
    toast({ title: "Wallet Disconnected", variant: "info" });
  }, [sdks, toast]);

  const doCheckIn = useCallback(async () => {
    if (!userData) return;
    setIsCheckingIn(true);
    try {
      const { wallet } = await import("@earnwithalee/stacksrank-sdk");
      const { STACKS_CONTRACT_ADDRESS, STACKS_CONTRACT_NAME } = await import("@/config/constants");

      const tx: any = await wallet.callContract({
        contract: `${STACKS_CONTRACT_ADDRESS}.${STACKS_CONTRACT_NAME}`,
        functionName: "check-in",
        functionArgs: [],
        network: 'mainnet'
      });
      
      setIsCheckingIn(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      if (tx && tx.txId) {
        pollTxStatus(tx.txId);
      } else {
        toast({ title: "Check-in Initiated", variant: "success" });
      }
    } catch (error) {
      console.error("Check-in error:", error);
      setIsCheckingIn(false);
      toast({ title: "Error", description: "Failed to initiate transaction", variant: "error" });
    }
  }, [userData, pollTxStatus, toast]);

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
      if (tx && tx.txId) {
        setPulseTxId(tx.txId);
        pollTxStatus(tx.txId);
      }
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
        txStatus,
        lastTxId,
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
