import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  FontWeights,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import logo from "./logo.svg";
import "./HomePage.css";
import { LCDClient, Coin } from "@terra-money/terra.js";
import FadeIn from "react-fade-in";
import { useHistory } from "react-router-dom";
import { globalStyles } from "../../assets/styles";
import CreateAccount from "../createaccount/CreateAccount";
import { ImportAccount } from "../importaccount/ImportAccount";

const stackTokens: IStackTokens = { childrenGap: 15 };
const variants = {
  y: { from: -200, to: 0 },
};

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const HomePage: React.FunctionComponent = () => {
  const history = useHistory();

  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [displayCreate, setDisplayCreate] = useState(false);
  const [displayImport, setDisplayImport] = useState(false);

  useEffect(() => {
    const address = localStorage.getItem("address");
    if (address) {
      history.push("/dashboard");
    }
  }, []);

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="start"
      verticalFill
      styles={{
        root: {
          width: "960px",
          margin: "0 auto",
          textAlign: "center",
          color: "#605e5c",
        },
      }}
      tokens={stackTokens}
    >
      <Stack.Item
        styles={{
          root: {
            alignItems: "end",
            display: "flex",
            justifyContent: "end",
            height: "50%",
          },
        }}
      >
        <Stack
          horizontalAlign="center"
          verticalAlign="end"
          verticalFill
          tokens={stackTokens}
        >
          <img className="App-logo" src={logo} alt="logo" />
          <Text variant="xxLarge" styles={globalStyles.bold}>
            Welcome to TerraPay
          </Text>

          <Stack horizontal tokens={stackTokens} horizontalAlign="center">
            <DefaultButton
              onClick={() => {
                if (displayImport) {
                  setDisplayImport(false);
                  setTimeout(() => {
                    setShowCreate(true);
                    setDisplayCreate(true);
                  }, 500);
                } else {
                  setShowCreate(true);
                  setDisplayCreate(!displayCreate);
                }
              }}
            >
              Create Account
            </DefaultButton>
            <PrimaryButton
              onClick={() => {
                if (displayCreate) {
                  setDisplayCreate(false);
                  setTimeout(() => {
                    setShowImport(true);
                    setDisplayImport(true);
                  }, 500);
                } else {
                  setShowImport(true);
                  setDisplayImport(!displayImport);
                }
              }}
            >
              Import Account
            </PrimaryButton>
          </Stack>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        {showCreate && (
          <FadeIn
            visible={displayCreate}
            onComplete={() => {
              setShowCreate(displayCreate);
            }}
          >
            <CreateAccount />
          </FadeIn>
        )}
        {showImport && (
          <FadeIn
            visible={displayImport}
            onComplete={() => {
              setShowImport(displayImport);
            }}
          >
            <ImportAccount />
          </FadeIn>
        )}
      </Stack.Item>
    </Stack>
  );
};
