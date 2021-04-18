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
import { Scrollbars } from "react-custom-scrollbars";
import { Separator } from "@fluentui/react/lib/Separator";
import "./AddFriends.css";
import { globalEmitter } from "../../helpers/emitter";
import { LCDClient, Coin, MnemonicKey } from "@terra-money/terra.js";
import { useHistory } from "react-router-dom";
import {
  getFriendRequests,
  sendFriendRequest,
  getPublicKey,
  getPrimeNumber,
  sendResponse,
  denyFriendRequest,
} from "../../helpers/network";
import { globalStyles } from "../../assets/styles";

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

export const AddFriends: React.FunctionComponent = () => {
  const history = useHistory();
  const [friendUsername, setFriendUsername] = useState<string>("");
  const [allRequests, setAllRequests] = useState<FriendRequest[]>([]);
  const bigInt = require("big-integer");
  const CryptoJS = require("crypto-js");

  const getRequests = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      history.push("/");
      return;
    }
    const data = await getFriendRequests(username);
    const output: FriendRequest[] = [];
    for (let i = 0; i < data.requests.length; i++) {
      const item: FriendRequest = data.requests[i];
      output.push({
        ...item,
        decryptedAddress: await decryptAddress(item.sender, item.address),
      });
    }
    setAllRequests(output);
  };

  useEffect(() => {
    getRequests();
  }, []);

  const onChangeUsername = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    if (newValue) {
      setFriendUsername(newValue);
    } else {
      setFriendUsername("");
    }
  };

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

  const getSharedKey = async (friendUsername: string) => {
    const private_key = localStorage.getItem("private_key");
    const username = localStorage.getItem("username");
    if (!username || !private_key) {
      history.push("/");
      return -1;
    }
    const friendsPublicKey = await getPublicKey(friendUsername);
    if (!friendsPublicKey.publicKey) {
      globalEmitter.emit("notification", {
        type: "error",
        message: "The username you have input is invalid.",
      });
      return -1;
    }
    const prime = await getPrimeNumber();
    // Calculate shared secret
    return bigInt(friendsPublicKey.publicKey).modPow(
      parseInt(private_key),
      prime.value
    );
  };

  const handleFriendRequest = async () => {
    if (friendUsername != "") {
      const shared = await getSharedKey(friendUsername);
      if (shared == -1) {
        return;
      }
      const terraAddress = localStorage.getItem("address");
      const encryptedTerraAddress = CryptoJS.AES.encrypt(
        terraAddress,
        shared.toString()
      ).toString();
      const username = localStorage.getItem("username");

      const result = await sendFriendRequest(
        username!!,
        friendUsername,
        encryptedTerraAddress
      );
      if (result.success === false) {
        globalEmitter.emit("notification", {
          type: "error",
          message: result.message,
        });
      } else {
        globalEmitter.emit("notification", {
          type: "success",
          message: "Request sent",
        });
      }
      setFriendUsername("");
    } else {
      globalEmitter.emit("notification", {
        type: "error",
        message: "Please enter a valid username to send a friend request to.",
      });
    }
  };

  const acceptFriendRequest = async (
    sender: string,
    recipient: string,
    decryptedAddress: string
  ) => {
    const shared = await getSharedKey(recipient);
    const terraAddress = localStorage.getItem("address");
    const encryptedTerraAddress = CryptoJS.AES.encrypt(
      terraAddress,
      shared.toString()
    ).toString();
    sendResponse(sender, recipient, encryptedTerraAddress);
    const friends = JSON.parse(localStorage.getItem("friends") ?? "[]");
    friends.push({ username: recipient, address: decryptedAddress });
    localStorage.setItem("friends", JSON.stringify(friends));

    const output = allRequests.filter((item) => item.sender !== recipient);
    setAllRequests(output);
  };

  const rejectFriendRequest = async (sender: string, recipient: string) => {
    denyFriendRequest(sender, recipient);
    const output = allRequests.filter((item) => item.sender !== sender);
    setAllRequests(output);
  };

  return (
    <Stack
      styles={{
        root: {
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        },
      }}
    >
      <Text variant="xxLarge" styles={boldStyle}>
        Please enter your friend's username:
      </Text>
      <Stack horizontal>
        <TextField
          placeholder="Username"
          value={friendUsername}
          onChange={onChangeUsername}
          styles={{
            fieldGroup: { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
          }}
        />
        <PrimaryButton
          onClick={handleFriendRequest}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          Send request
        </PrimaryButton>
      </Stack>
      {allRequests.map((req) => (
        <div>
          {`${req.sender} ${req.decryptedAddress}`}
          <PrimaryButton
            onClick={() =>
              acceptFriendRequest(
                req.recipient,
                req.sender,
                req.decryptedAddress
              )
            }
          >
            Accept
          </PrimaryButton>
          <DefaultButton
            onClick={() => rejectFriendRequest(req.sender, req.recipient)}
          >
            Reject
          </DefaultButton>
        </div>
      ))}
      <Text variant="xxLarge" styles={boldStyle}>
        Your friends
      </Text>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",

          width: "30%",
          overflow: "hidden",
          padding: "50px",
          height: "50%",
          border: `4px solid ${globalStyles.colors.emphasis}`,
          borderRadius: 10,
          borderTopLeftRadius: 40,
          borderBottomLeftRadius: 40,
        }}
      >
        <Scrollbars autoHeight autoHeightMin={600}>
          <Stack
            styles={{
              root: {
                alignItems: "flex-end",
                display: "flex",
                justifyContent: "flex-end",
                overflow: "hidden",
                height: "100%",
              },
            }}
          >
            {JSON.parse(localStorage.getItem("friends") ?? "[]").map(
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
                      backgroundColor: "white",
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
          </Stack>
        </Scrollbars>
      </div>
      <Stack.Item style={{ marginTop: "auto" }}>
        <Text variant="small" styles={boldStyle}>
          Your address: {localStorage.getItem("address")}
        </Text>
      </Stack.Item>
    </Stack>
  );
};
