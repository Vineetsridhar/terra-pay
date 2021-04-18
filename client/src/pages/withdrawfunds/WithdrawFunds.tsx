import { Coins, LCDClient, MnemonicKey, MsgSend } from "@terra-money/terra.js";
import React from "react";
import { globalEmitter } from "../../helpers/emitter";
import { getPoolAddress } from "../../helpers/network";
import { CheckoutForm } from "../addfunds/CheckoutForm";

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
  gasPrices: new Coins({ uusd: 0.3 }),
  gasAdjustment: 1.5,
});

export function WithdrawFunds() {
    const sendMoney = async (amt:number) => {
        const mnemonic = localStorage.getItem('mnemonic');
        const balance = 100;
        const address = await getPoolAddress()
        amt /= 100
        if (amt - 0.3 <= balance && mnemonic != "") {
          // Try to process transaction
          const mk = new MnemonicKey({ mnemonic: mnemonic!! });
          const localAddress = localStorage.getItem("address");
          const username = localStorage.getItem("username");
          const wallet = terra.wallet(mk);
    
          // create a simple message that moves coin balances
          if (localAddress && username) {
            const send = new MsgSend(localAddress, address["address"], {
              uusd: amt * 1000000,
            });
            console.log(send)
            return wallet
              .createAndSignTx({
                msgs: [send],
                memo: "From" + username,
              })
              .then((tx) => {
                console.log(tx);
                return terra.tx.broadcast(tx);
              })
              .then((result) => {
                globalEmitter.emit("notification", {
                  type: "success",
                  message: "Your money has been sent over the blockchain!",
                });
                console.log(`TX hash: ${result.txhash}`);
              })
              .catch((err) => {
                globalEmitter.emit("notification", {
                  type: "error",
                  message: "There was an error sending your money",
                });
    
                console.log("ERRRR", err)
              });
          }
        } else {
          console.log("error");
        }
      };
    
  return <CheckoutForm deposit={false} callback={sendMoney}/>;
}
