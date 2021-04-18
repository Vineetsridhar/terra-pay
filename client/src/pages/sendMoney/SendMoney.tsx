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
import { LCDClient, Coin, MnemonicKey } from "@terra-money/terra.js";
import { useHistory } from "react-router-dom";
import { getFriendRequests, sendFriendRequest } from "../../helpers/network";
import { Scrollbars } from "react-custom-scrollbars";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
interface FriendRequest {
  sender: string;
  recipient: string;
  value: number;
}
const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

const friends = [
  "qwe",
  "sdf",
  "cb",
  "cvb",
  "rtu",
  "dfg",
  "qwe",
  "sdf",
  "cb",
  "cvb",
  "rtu",
  "dfg",
  "qwe",
  "sdf",
  "cb",
  "cvb",
  "rtu",
  "dfg",
];

export const SendMoney: React.FunctionComponent = () => {
  const history = useHistory();
  const [selectedFriend, setSelectedFriend] = useState("");

  const prefix = "$ ";
  const min = 0;
  // By default the field grows to fit available width. Constrain the width instead.
  const styles: Partial<ISpinButtonStyles> = {
    spinButtonWrapper: { width: 75 },
    root: { display: "flex", justifyContent: "center", padding: "10px" },
  };

  /** Remove the prefix or any other text after the numbers, or return undefined if not a number */
  const getNumericPart = (value: string): number | undefined => {
    const valueRegex = /^\$\ (\d+(\.\d+)?)/;
    if (valueRegex.test(value)) {
      const numericValue = Number(value.replace(valueRegex, "$1"));
      return isNaN(numericValue) ? undefined : numericValue;
    }
    return undefined;
  };

  /** Increment the value (or return nothing to keep the previous value if invalid) */
  const onIncrement = (
    value: string,
    event?: React.SyntheticEvent<HTMLElement>
  ): string | void => {
    const numericValue = getNumericPart(value);
    if (numericValue !== undefined) {
      return prefix + String(numericValue + 1);
    }
  };

  /** Decrement the value (or return nothing to keep the previous value if invalid) */
  const onDecrement = (
    value: string,
    event?: React.SyntheticEvent<HTMLElement>
  ): string | void => {
    const numericValue = getNumericPart(value);
    if (numericValue !== undefined) {
      return prefix + String(Math.max(numericValue - 1, min));
    }
  };

  /**
   * Clamp the value within the valid range (or return nothing to keep the previous value
   * if there's not valid numeric input)
   */
  const onValidate = (
    value: string,
    event?: React.SyntheticEvent<HTMLElement>
  ): string | void => {
    let numericValue = getNumericPart(value);
    if (numericValue !== undefined) {
      numericValue = Math.max(numericValue, min);
      return prefix + String(numericValue);
    }
  };

  /** This will be called after each change */
  const onChange = (
    event: React.SyntheticEvent<HTMLElement>,
    value?: string
  ): void => {
    console.log("Value changed to " + value);
  };

  return (
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
    >
      <Stack.Item
        disableShrink
        styles={{
          root: {
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end",
            overflow: "hidden",
            width: "40%",
            height: "100%",
          },
        }}
      >
        <Stack
          horizontal
          styles={{
            root: {
              alignItems: "center",
              overflow: "hidden",
            },
          }}
        >
          <Text variant="xxLarge" styles={boldStyle}>
            Send
          </Text>
          <SpinButton
            label=""
            defaultValue={prefix + "7"}
            min={min}
            onValidate={onValidate}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onChange={onChange}
            incrementButtonAriaLabel="Increase value by 2"
            decrementButtonAriaLabel="Decrease value by 2"
            styles={styles}
          />
          <Text
            variant="xxLarge"
            styles={{
              root: { fontWeight: FontWeights.semibold, whiteSpace: "nowrap" },
            }}
          >
            To:
          </Text>
        </Stack>
      </Stack.Item>
      <Stack.Item
        styles={{
          root: {
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-begin",
            overflow: "hidden",
            padding: "50px",
            height: "100%",
          },
        }}
      >
        <Scrollbars autoHeight autoHeightMin={600}>
          <Stack
            styles={{
              root: {
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
                height: "100%",
                minWidth: 200,
              },
            }}
          >
            {friends.map((friendName) => (
              <Stack.Item
                styles={{
                  root: {
                    padding: 5,
                  },
                }}
              >
                <div
                  style={{
                    width: 100,
                    border: "3px solid rgb(0, 120, 212)",
                    boxShadow: "0 0 10px #9ecaed",
                    borderRadius: 10,
                    backgroundColor: `${
                      selectedFriend === friendName ? "grey" : "white"
                    }`,
                    padding: 8,
                  }}
                  onClick={() => {
                    setSelectedFriend(friendName);
                  }}
                >
                  <Persona text={friendName} size={PersonaSize.size48} />
                </div>
              </Stack.Item>
            ))}
          </Stack>
        </Scrollbars>
      </Stack.Item>
      <Stack.Item>
        <PrimaryButton>Send</PrimaryButton>
      </Stack.Item>
    </Stack>
  );
};
