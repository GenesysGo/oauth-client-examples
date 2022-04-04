import type { NextPage } from "next";
import React, { FC, ReactNode, useMemo, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, ConnectionConfig } from "@solana/web3.js";
import Home from "./home";
import { tokenAuthFetchMiddleware } from "@strata-foundation/web3-token-auth";
import { getToken } from "../util";

require("@solana/wallet-adapter-react-ui/styles.css");

const App: FC = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  // const token = useMemo(() => getToken(), [timedOut])
  // You can also provide a custom RPC endpoint.
  const endpoint = process.env.NEXT_PUBLIC_RPC!;

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );
  const connectionConfig: ConnectionConfig = {
    commitment: "confirmed",
    fetchMiddleware: tokenAuthFetchMiddleware({
      tokenExpiry: 180000,
      getToken,
    }),
  };
  return (
    <ConnectionProvider endpoint={endpoint} config={connectionConfig}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Home></Home>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
export default App;
