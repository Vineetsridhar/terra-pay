import { Coins, LCDClient, MnemonicKey, MsgSend } from "@terra-money/terra.js";
import React, { useEffect, useState } from "react";
import { globalEmitter } from "../../helpers/emitter";
import { getPoolAddress } from "../../helpers/network";
import { CheckoutForm } from "../addfunds/CheckoutForm";
import { useHistory } from 'react-router-dom'
import { Text } from "office-ui-fabric-react";

const terra = new LCDClient({
    URL: "https://tequila-lcd.terra.dev/",
    chainID: "tequila-0004",
    gasPrices: new Coins({ uusd: 0.5 }),
    gasAdjustment: 1.5,
});

export function WithdrawFunds() {
    const history = useHistory();

    const [balance, setBalance] = useState<number>(0);
    useEffect(() => {
        getBalance()
    }, [])

    async function getBalance() {
        const address = localStorage.getItem("address");
        if (!address) {
            history.push("/");
            return;
        }
        const coinBalances = await terra.bank.balance(address);
        const usdBalance = coinBalances.get("uusd");
        if (usdBalance) {
            const balance = parseFloat(usdBalance.amount.toString()) / 1000000;
            setBalance(balance);
        }
    }
  const getTwoDecimalsBalance = () => {
    if (balance) {
      var with2Decimals = balance.toString().match(/^-?\d+(?:\.\d{0,2})?/);
      if (with2Decimals?.length == 1)
        return with2Decimals[0];
      else
        return balance;
    }
    else {
      return 0;
    }
  }

    const sendMoney = async (amt: number) => {
        const mnemonic = localStorage.getItem('mnemonic');
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
            globalEmitter.emit("notification", {
                type: "error",
                message: "You don't have enough money",
            });
            throw "err"
        }
    };

    return (
        <div style={{display:'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height:'100%'}}>
            <Text variant="xxLarge">
                Your Balance: ${getTwoDecimalsBalance()}
            </Text>
            <br/>
            <CheckoutForm deposit={false} callback={sendMoney} />
        </div>)
}
