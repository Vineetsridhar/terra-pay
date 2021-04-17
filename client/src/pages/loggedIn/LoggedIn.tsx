import React from "react";
import {
  Stack,
  Text,
  Link,
  FontWeights,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import { Separator } from "@fluentui/react/lib/Separator";
import "./LoggedIn.css";
import { LCDClient, Coin } from "@terra-money/terra.js";
import logo from "../homepage/logo.svg";

const boldStyle = { root: { fontWeight: FontWeights.semibold } };
const stackTokens: IStackTokens = { childrenGap: 15 };

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const LoggedIn: React.FunctionComponent = () => {
  return (
    <Stack horizontal styles={{ root: { height: "100%" } }}>
      <Stack.Item
        disableShrink
        styles={{
          root: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            width: "200px",
            height: "100%",
            borderRight: "2px solid grey",
          },
        }}
      >
        <Stack
          horizontalAlign="center"
          verticalAlign="start"
          verticalFill
          styles={{
            root: {
              margin: "0 auto",
              textAlign: "center",
              color: "#605e5c",
            },
          }}
          tokens={stackTokens}
        >
          <img className="App-logo" src={logo} alt="logo" />
          <Text variant="xxLarge" styles={boldStyle}>
            TerraPay
          </Text>
          <Separator />

          <DefaultButton href="/"> Home</DefaultButton>
          <PrimaryButton href="/"> About </PrimaryButton>
        </Stack>
      </Stack.Item>
      <Stack.Item grow>
        <Text variant="xxLarge" styles={boldStyle}>
          sjlkdfn
        </Text>
      </Stack.Item>
    </Stack>
  );
};
