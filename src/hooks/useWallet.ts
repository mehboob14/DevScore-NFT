import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
  });

  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true }));

    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a mock Qubic testnet address
      const mockAddress = "QUBIC" + Array.from({ length: 56 }, () => 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"[Math.floor(Math.random() * 32)]
      ).join("");

      setWallet({
        isConnected: true,
        address: mockAddress,
        isConnecting: false,
      });

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Qubic Testnet",
      });
    } catch (error) {
      setWallet((prev) => ({ ...prev, isConnecting: false }));
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      isConnecting: false,
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  }, []);

  return {
    ...wallet,
    connect,
    disconnect,
  };
};
