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
  SpinButton,
  ISpinButtonStyles,
  Persona,
  PersonaSize,
} from "@fluentui/react";
import { Separator } from "@fluentui/react/lib/Separator";
import "./SendMoney.css";
import { globalEmitter } from "../../helpers/emitter";
import {
  LCDClient,
  Coin,
  MnemonicKey,
  Coins,
  MsgSend,
} from "@terra-money/terra.js";
import { useHistory } from "react-router-dom";
import {
  getFriendResponses,
  denyFriendRequest,
  getPrimeNumber,
  getPublicKey,
} from "../../helpers/network";
import { Scrollbars } from "react-custom-scrollbars";
import { globalStyles } from "../../assets/styles";
import bigInt from "big-integer";
import ReactLoading from 'react-loading';

const CryptoJS = require("crypto-js");

const boldStyle = { root: {} };
const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
  gasPrices: new Coins({ uusd: 0.3 }),
  gasAdjustment: 1.5,
});

export const SendMoney: React.FunctionComponent = () => {
  const history = useHistory();
  const [selectedFriend, setSelectedFriend] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [mnemonic, setMnemonicKey] = useState<string>("");
  const [friends, setFriends] = useState<
    { username: string; address: string }[]
  >([]);
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false)

  const prefix = "$ ";
  const min = 0;
  // By default the field grows to fit available width. Constrain the width instead.
  const styles: Partial<ISpinButtonStyles> = {
    spinButtonWrapper: { width: 75 },
    root: { display: "flex", justifyContent: "center", padding: "10px" },
  };
  const stackTokens: IStackTokens = { childrenGap: 20 };

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

  useEffect(() => {
    getBalance();
    const mnemonic = localStorage.getItem("mnemonic");
    if (mnemonic) setMnemonicKey(mnemonic);
  }, []);

  const decryptAddress = async (sender: string, address: string) => {
    const private_key = localStorage.getItem("private_key");
    const friendsPublicKey = await getPublicKey(sender);
    const prime = await getPrimeNumber();
    if (!private_key) {
      return;
    }
    const shared = bigInt(friendsPublicKey.publicKey).modPow(
      parseInt(private_key),
      prime.value
    );
    return CryptoJS.AES.decrypt(address, shared.toString()).toString(
      CryptoJS.enc.Utf8
    );
  };

  const getResponses = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      history.push("/");
      return;
    }
    const responses = await getFriendResponses(username);
    let friends = JSON.parse(localStorage.getItem("friends") ?? "[]");
    for (let i = 0; i < responses.responses.length; i++) {
      const curr = responses.responses[i];
      const address = await decryptAddress(curr["sender"], curr["address"]);
      friends.push({ username: curr["sender"], address });
      denyFriendRequest(curr["sender"], curr["recipient"]);
    }
    localStorage.setItem("friends", JSON.stringify(friends));
    setFriends(friends); // Just trigger a rerender
  };

  useEffect(() => {
    getResponses();
  }, []);

  const sendMoney = async () => {
    setLoading(true)
    const friends = JSON.parse(localStorage.getItem("friends") ?? "[]");
    const recipient = friends.find(
      (friend: { username: string }) => friend.username == selectedFriend
    );
    const amt = parseFloat(amount);
    if (isNaN(amt)) {
      globalEmitter.emit("notification", {
        type: "error",
        message: "Please enter a valid number",
      });
      return;
    }

    if (amt - 0.3 <= balance && mnemonic != "") {
      // Try to process transaction
      const mk = new MnemonicKey({ mnemonic: mnemonic });
      const localAddress = localStorage.getItem("address");
      const username = localStorage.getItem("username");
      const wallet = terra.wallet(mk);

      // create a simple message that moves coin balances
      if (localAddress && username) {
        const send = new MsgSend(localAddress, recipient["address"], {
          uusd: amt * 1000000,
        });
        console.log(send)
        wallet
          .createAndSignTx({
            msgs: [send],
            memo: "From" + username,
          })
          .then((tx) => {
            console.log(tx);
            return terra.tx.broadcast(tx);
          })
          .then((result) => {
            setAmount("")
            getBalance()
            setSelectedFriend("")
            setLoading(false)
            globalEmitter.emit("notification", {
              type: "success",
              message: "Your money has been sent over the blockchain!",
            });
            console.log(`TX hash: ${result.txhash}`);
          })
          .catch((err) => {
            setLoading(false)
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

  return (
    <>
      <Stack
        styles={{
          root: {
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-start",
            overflow: "hidden",
            height: "100%",
          },
        }}
      >
        <Text variant="xxLarge" styles={boldStyle}>
          Your Balance: ${balance.toFixed(2)}
        </Text>
        <Stack
          horizontal
          styles={{
            root: {
              alignItems: "center",
              display: "flex",
              justifyContent: "flex-start",
              overflow: "hidden",
              height: "100%",
            },
          }}
          tokens={stackTokens}
        >
          <Stack.Item
            disableShrink
            styles={{
              root: {
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",

                width: "30%",
                overflow: "hidden",
                padding: "50px",
                height: "50%",
                border: `4px solid ${globalStyles.colors.emphasis}`,
                borderRadius: 10,
                borderTopLeftRadius: 50,
                borderBottomLeftRadius: 50,
                fontFamily: "inherit"
              },
            }}
          >
            <Scrollbars autoHeight autoHeightMin={600}>
              <Stack
                styles={{
                  root: {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                    overflow: "hidden",
                    height: "100%",
                  },
                }}
              >
                <Text variant="xxLarge" styles={boldStyle}>
                  Your Friends
                </Text>
                {friends.map(
                  (friend: { username: string; address: string }) => (
                    <Stack.Item
                      styles={{
                        root: {
                          padding: 5,
                        },
                      }}
                    >
                      <div
                        style={{
                          width: 200,
                          border: `2px solid ${globalStyles.colors.emphasis}`,
                          boxShadow: "0 0 2px #9ecaed",
                          borderRadius: 10,
                          borderTopLeftRadius: 50,
                          borderBottomLeftRadius: 50,
                          overflow: "hidden",
                          backgroundColor: `${selectedFriend === friend.username
                            ? "grey"
                            : "white"
                            }`,
                        }}
                        onClick={() => {
                          setSelectedFriend(friend.username);
                        }}
                      >
                        <Persona
                          text={friend.username}
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
                          }}
                        />
                      </div>
                    </Stack.Item>
                  )
                )}
                {friends.length == 0 &&
                  <Text variant="large" styles={{ root: { textAlign: 'center', paddingTop: 16 } }}>
                    Add new friends before you can send money
                </Text>}
              </Stack>
            </Scrollbars>
          </Stack.Item>

          <Stack.Item
            styles={{
              root: {
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",
                overflow: "hidden",
                height: "60%",
                border: `4px solid ${globalStyles.colors.emphasis}`,
                borderRadius: 10,
                borderTopRightRadius: 50,
                borderBottomRightRadius: 50,
              },
            }}
          >
            <Stack
              styles={{
                root: {
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  overflow: "hidden",
                },
              }}
            >
              <Text variant="mega" styles={boldStyle}>
                Send
              </Text>

              <TextField
                styles={{
                  root: { width: "50%" },
                  fieldGroup: {
                    height: "3em",
                    border: `2px solid ${globalStyles.colors.emphasis}`,
                    borderRadius: 15,
                  },
                  field: { fontSize: "3em" },
                }}
                placeholder="Amount"
                value={amount}
                onChange={(value, text) => {
                  if (text) {
                    setAmount(text);
                  } else setAmount("")
                }}
              />
              <Stack
                horizontal
                styles={{
                  root: {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    overflow: "hidden",
                    height: "100%",
                    minHeight: "200px",
                  },
                }}
              >
                {selectedFriend &&
                  <Text
                    variant="mega"
                    styles={{
                      root: {
                        fontWeight: FontWeights.semibold,
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    To:
                </Text>
                }
                {selectedFriend && (
                  <div
                    style={{
                      width: 200,
                      border: `2px solid ${globalStyles.colors.emphasis}`,
                      boxShadow: "0 0 2px #9ecaed",
                      borderRadius: 50,
                      overflow: "hidden",
                      backgroundColor: "white",
                      marginTop: "1em",
                      marginLeft: "1em",
                    }}
                  >
                    <Persona
                      text={selectedFriend}
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
                      }}
                    />
                  </div>
                )}
              </Stack>
              {loading ? <ReactLoading type={"spin"} color={"white"} height={100} width={100} /> :
                <PrimaryButton
                  styles={{ root: { height: "100px", width: "300px" } }}
                  disabled={selectedFriend === ""}
                  onClick={sendMoney}
                >
                  <Text
                    variant="mega"
                    styles={{
                      root: {
                        fontWeight: FontWeights.semibold,
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    Pay
                </Text>
                </PrimaryButton>
              }
            </Stack>
          </Stack.Item>
        </Stack>
        <Text variant="small" styles={boldStyle}>
          Your address: {localStorage.getItem("address")}
        </Text>
      </Stack>
    </>
  );
};
