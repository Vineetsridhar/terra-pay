import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  Link,
  Label,
  TextField,
  FontWeights,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import { Separator } from "@fluentui/react/lib/Separator";
import "./History.css";
import { globalEmitter } from "../../helpers/emitter";
import { LCDClient, Coin, MnemonicKey } from "@terra-money/terra.js";
import { useHistory } from 'react-router-dom'
import { getFriendRequests, sendFriendRequest, getPublicKey, getPrimeNumber, sendResponse, denyFriendRequest } from "../../helpers/network";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
interface FriendRequest {
  sender: string,
  recipient: string,
  address: string,
  decryptedAddress: string
}
const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const History: React.FunctionComponent = () => {
  const history = useHistory();
  const [friendUsername, setFriendUsername] = useState<string>("")
  const bigInt = require("big-integer");
  const CryptoJS = require("crypto-js");
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  
  const populateHistory = async (address:string, transactions:[]) => {
    const incomingTx:any = [];
    const outgoingTx:any = [];
    transactions.forEach((element:any) => {
      if(element){
        // Check if transaction is successful
        const failedTx = element.raw_log.includes('failed to execute');
        if(!failedTx){
          let memo = element.tx.value.memo;

          if(memo.includes('Terra-Pay')){
            //Parse
            const amountUsd = element.tx.value.msg[0].value.amount[0].amount/1000000;
            const fromAddress = element.tx.value.msg[0].value.from_address;
            const toAddress = element.tx.value.msg[0].value.to_address;

            memo = memo.substring(11).split('~');
            let parties = memo[0].split(' ');
            let message = memo[1];
            let from = parties[1];
            let to = parties[3];

            //Outgoing tx
            if(fromAddress == address){
              outgoingTx.push({ 'username': to, 'amount': amountUsd, 'message': message });
            }
            else{ //Incoming tx
              incomingTx.push({ 'username': from, 'amount': amountUsd, 'message': message });
            }
          }
        }
      }
    });
    setIncoming(incomingTx);
    setOutgoing(outgoingTx);
  }

  useEffect(() => {
    const address = localStorage.getItem('address');
    if(address){
      fetch('https://tequila-fcd.terra.dev/v1/txs?offset=0&limit=100&account=' + address + '&chainId=tequila-0004')
      .then(response => response.json())
      .then(data => populateHistory(address, data.txs));
    }
  }, [])
  
  return (
    <Stack>
      <Text variant="small" styles={boldStyle}>
        Your address: {localStorage.getItem("address")}
      </Text>
      <Text variant="xxLarge" styles={boldStyle}>
        Outgoing Transactions
      </Text>
      {outgoing.map(
                  (transaction: { username: string; amount: number; message: string }) => (
                    <Text>To: {transaction.username}, Amount: {transaction.amount}, Message: {transaction.message}</Text>
                  )
                )}
      <Text variant="xxLarge" styles={boldStyle}>
        Incoming Transactions
      </Text> 
        {incoming.map(
                  (transaction: { username: string; amount: number; message: string }) => (
                    <Text>From: {transaction.username}, Amount: {transaction.amount}, Message: {transaction.message}</Text>
                  )
                )}
    </Stack>
  );
};
