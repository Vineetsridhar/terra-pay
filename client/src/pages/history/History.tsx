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
  Persona,
  PersonaSize,
} from "@fluentui/react";
import { Separator } from "@fluentui/react/lib/Separator";
import "./History.css";
import { globalEmitter } from "../../helpers/emitter";
import { LCDClient, Coin, MnemonicKey } from "@terra-money/terra.js";
import { useHistory } from "react-router-dom";
import { globalStyles } from "../../assets/styles";
import { Scrollbars } from "react-custom-scrollbars";
import {
  getFriendRequests,
  sendFriendRequest,
  getPublicKey,
  getPrimeNumber,
  sendResponse,
  denyFriendRequest,
} from "../../helpers/network";
import { send } from "node:process";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
interface FriendRequest {
  sender: string;
  recipient: string;
  address: string;
  decryptedAddress: string;
}
const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const History: React.FunctionComponent = () => {
  const history = useHistory();
  const [friendUsername, setFriendUsername] = useState<string>("");
  const bigInt = require("big-integer");
  const CryptoJS = require("crypto-js");
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const populateHistory = async (address: string, transactions: []) => {
    const incomingTx: any = [];
    const outgoingTx: any = [];
    transactions.forEach((element: any) => {
      if (element) {
        // Check if transaction is successful
        const failedTx = element.raw_log.includes("failed to execute");
        if (!failedTx) {
          let memo = element.tx.value.memo;

          if (memo.includes("Terra-Pay")) {
            //Parse
            const amountUsd =
              element.tx.value.msg[0].value.amount[0].amount / 1000000;
            const fromAddress = element.tx.value.msg[0].value.from_address;
            const toAddress = element.tx.value.msg[0].value.to_address;

            memo = memo.substring(11);
            const friends = JSON.parse(localStorage.getItem("friends") ?? "[]");

            //Outgoing tx
            if (fromAddress == address) {
              const recipient = friends.find(
                (friend: { username: string; address: string }) =>
                  friend.address == toAddress
              );
              if (recipient) {
                outgoingTx.push({
                  username: recipient.username,
                  amount: amountUsd,
                  message: memo,
                });
              }
            } else {
              //Incoming tx
              const sender = friends.find(
                (friend: { username: string; address: string }) =>
                  friend.address == fromAddress
              );
              if (sender) {
                incomingTx.push({
                  username: sender.username,
                  amount: amountUsd,
                  message: memo,
                });
              }
            }
          }
        }
      }
    });
    setIncoming(incomingTx);
    setOutgoing(outgoingTx);
  };

  useEffect(() => {
    const address = localStorage.getItem("address");
    if (address) {
      fetch(
        "https://tequila-fcd.terra.dev/v1/txs?offset=0&limit=100&account=" +
          address +
          "&chainId=tequila-0004"
      )
        .then((response) => response.json())
        .then((data) => populateHistory(address, data.txs));
    }
  }, []);
  const stackTokens: IStackTokens = { childrenGap: 40 };
  return (
    <Stack
      styles={{
        root: {
          alignItems: "center",
          display: "flex",
          justifyContent: "center",

          width: "100%",
          overflow: "hidden",
          height: "100%",
          fontFamily: "inherit",
        },
      }}
    >
      <Stack
        horizontal
        styles={{
          root: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",

            width: "100%",
            overflow: "hidden",
            height: "100%",
            fontFamily: "inherit",
          },
        }}
        tokens={stackTokens}
      >
        <Stack.Item>
          <Stack
            styles={{
              root: {
                alignItems: "flex-end",
                display: "flex",
                justifyContent: "center",

                width: "100%",
                overflow: "hidden",
                height: "100%",
                fontFamily: "inherit",
              },
            }}
          >
            <Text variant="xxLarge" styles={boldStyle}>
              You Sent
            </Text>
            <Stack.Item
              disableShrink
              styles={{
                root: {
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",

                  width: "70%",
                  overflow: "hidden",
                  padding: "50px",
                  height: "75%",
                  border: `4px solid ${globalStyles.colors.emphasis}`,
                  borderRadius: 10,
                  borderTopLeftRadius: 50,
                  borderBottomLeftRadius: 50,
                  fontFamily: "inherit",
                },
              }}
            >
              <Scrollbars autoHeight autoHeightMin={200}>
                <Stack
                  styles={{
                    root: {
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "flex-end",
                      overflow: "hidden",
                      height: "75%",
                    },
                  }}
                >
                  {outgoing.map(
                    (transaction: {
                      username: string;
                      amount: number;
                      message: string;
                    }) => (
                      <Stack.Item
                        styles={{
                          root: {
                            padding: 5,
                          },
                        }}
                      >
                        <div
                          style={{
                            width: "250px",
                            border: `2px solid ${globalStyles.colors.emphasis}`,
                            boxShadow: "0 0 2px #9ecaed",
                            borderRadius: 10,
                            borderTopLeftRadius: 30,
                            borderBottomLeftRadius: 30,
                            overflow: "hidden",
                            backgroundColor: "white",
                          }}
                        >
                          <Persona
                            text={transaction.username}
                            secondaryText={`$${transaction.amount} - ${transaction.message}`}
                            size={PersonaSize.size56}
                            styles={{
                              root: {
                                backgroundColor:
                                  globalStyles.colors.background2,
                                borderWidth: 2,
                                borderRadius: 2,
                                padding: 2,
                              },
                              primaryText: {
                                color: globalStyles.colors.text,
                              },
                              secondaryText: {
                                color: globalStyles.colors.text,
                              },
                            }}
                          />
                        </div>
                      </Stack.Item>
                    )
                  )}
                  {outgoing.length == 0 && (
                    <Text
                      variant="large"
                      styles={{ root: { textAlign: "center", paddingTop: 16 } }}
                    >
                      No Transactions
                    </Text>
                  )}
                </Stack>
              </Scrollbars>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <Text variant="xxLarge" styles={boldStyle}>
            You Received
          </Text>
          <Stack.Item
            disableShrink
            styles={{
              root: {
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",

                width: "75%",
                overflow: "hidden",
                padding: "50px",
                height: "75%",
                border: `4px solid ${globalStyles.colors.emphasis}`,
                borderRadius: 10,
                borderTopRightRadius: 50,
                borderBottomRightRadius: 50,
                fontFamily: "inherit",
              },
            }}
          >
            <Scrollbars autoHeight autoHeightMin={200}>
              <Stack
                styles={{
                  root: {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                    overflow: "hidden",
                    height: "75%",
                  },
                }}
              >
                {incoming.map(
                  (transaction: {
                    username: string;
                    amount: number;
                    message: string;
                  }) => (
                    <Stack.Item
                      styles={{
                        root: {
                          padding: 5,
                        },
                      }}
                    >
                      <div
                        style={{
                          width: "250px",
                          border: `2px solid ${globalStyles.colors.emphasis}`,
                          boxShadow: "0 0 2px #9ecaed",
                          borderRadius: 10,
                          borderTopLeftRadius: 30,
                          borderBottomLeftRadius: 30,
                          overflow: "hidden",
                          backgroundColor: "white",
                        }}
                      >
                        <Persona
                          text={transaction.username}
                          secondaryText={`$${transaction.amount} - ${transaction.message}`}
                          size={PersonaSize.size56}
                          styles={{
                            root: {
                              backgroundColor: globalStyles.colors.background2,
                              borderWidth: 2,
                              borderRadius: 2,
                              padding: 2,
                            },
                            primaryText: {
                              color: globalStyles.colors.text,
                            },
                            secondaryText: {
                              color: globalStyles.colors.text,
                            },
                          }}
                        />
                      </div>
                    </Stack.Item>
                  )
                )}
                {outgoing.length == 0 && (
                  <Text
                    variant="large"
                    styles={{ root: { textAlign: "center", paddingTop: 16 } }}
                  >
                    No Transactions
                  </Text>
                )}
              </Stack>
            </Scrollbars>
          </Stack.Item>
        </Stack.Item>
      </Stack>
      <Stack.Item style={{ marginTop: "auto" }}>
        <Text variant="small" styles={boldStyle}>
          Your address: {localStorage.getItem("address")}
        </Text>
      </Stack.Item>
    </Stack>
  );
};
