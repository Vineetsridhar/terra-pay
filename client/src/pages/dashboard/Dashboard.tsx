import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  FontWeights,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";
import { Separator } from "@fluentui/react/lib/Separator";
import "./Dashboard.css";
import CreateAccount from "../createaccount/CreateAccount";
import { HomePage } from "../homepage/HomePage";
import { LCDClient, Coin } from "@terra-money/terra.js";
import logo from "../homepage/logo.png";
import { useHistory } from "react-router-dom";
import { AddFunds } from "../addfunds/AddFunds";
import { AddFriends } from "../addfriends/AddFriends";
import { SendMoney } from "../sendMoney/SendMoney";
import { globalStyles } from "../../assets/styles";
import { WithdrawFunds } from "../withdrawfunds/WithdrawFunds";
import { History } from "../history/History";

const boldStyle = {
  root: {
    fontWeight: FontWeights.semibold, fontFamily: "'Comfortaa', cursive", 
  }
};
const stackTokens: IStackTokens = { childrenGap: 1 };

const terra = new LCDClient({
  URL: "https://tequila-lcd.terra.dev/",
  chainID: "tequila-0004",
});

export const Dashboard: React.FunctionComponent = () => {
  let { path, url } = useRouteMatch();
  const history = useHistory();
  const [balance, setBalance] = useState(0);

  const getBalanceData = async (address: string) => {
    const balance = await terra.bank.balance(address);
    console.log(balance.toArray());
  };

  useEffect(() => {
    const address = localStorage.getItem("address");
    if (!address) {
      history.push("/");
      return;
    }
    getBalanceData(address);
  }, []);
  return (
    <Stack
      horizontal
      styles={{ root: { height: "100%", color: globalStyles.colors.text } }}
    >
      <Stack.Item
        disableShrink
        styles={{
          root: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            width: "200px",
            fontFamily: "'Comfortaa', cursive",
            height: "100%",
            borderRight: `15px solid ${globalStyles.colors.emphasis}`,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            backgroundColor: globalStyles.colors.background2,
          },
        }}
      >
        <Stack
          horizontalAlign="center"
          verticalAlign="start"
          verticalFill
          styles={{
            root: {
              width: "100%",
              display: "flex",
              margin: "0",
              textAlign: "center",
            },
          }}
        // tokens={stackTokens}
        >
          <img className="App-logo" src={logo} alt="logo" />
          <Text
            variant="xLarge"
            styles={{
              root: {
                ...boldStyle.root,
                ...{ color: globalStyles.colors.text },
              },
            }}
          >
            TerraPay
          </Text>

          <Separator />
          <div
            className="navBarButton"
            style={{
              height: "4%",
              width: "95%",
              fontSize: "1.2em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: globalStyles.colors.text,
            }}
            onClick={() => {
              history.push("/dashboard/");
            }}
          >
            View History
          </div>

          <div
            className="navBarButton"
            style={{
              height: "4%",
              width: "95%",
              fontSize: "1.2em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: globalStyles.colors.text,
            }}
            onClick={() => {
              history.push("/dashboard/addFunds");
            }}
          >
            Deposit Funds
          </div>
          <div
            className="navBarButton"
            style={{
              height: "4%",
              width: "95%",
              fontSize: "1.2em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: globalStyles.colors.text,
            }}
            onClick={() => {
              history.push("/dashboard/withdraw");
            }}
          >
            Withdraw Funds
          </div>
          <div
            className="navBarButton"
            style={{
              height: "4%",
              width: "95%",
              fontSize: "1.2em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: globalStyles.colors.text,
            }}
            onClick={() => {
              history.push("/dashboard/addFriends");
            }}
          >
            Add Friends
          </div>
          <div
            className="navBarButton"
            style={{
              height: "4%",
              width: "95%",
              fontSize: "1.2em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: globalStyles.colors.text,
            }}
            onClick={() => {
              history.push("/dashboard/sendMoney");
            }}
          >
            Send Money
          </div>


        </Stack>
      </Stack.Item>
      <Stack.Item></Stack.Item>
      <Stack.Item grow>
        <Switch>
          <Route path={`${path}/withdraw`}>
            <WithdrawFunds />
          </Route>
          <Route path={`${path}/History`}>
            <History />
          </Route>
          <Route path={`${path}/addFriends`}>
            <AddFriends />
          </Route>
          <Route path={`${path}/addFunds`}>
            <AddFunds />
          </Route>
          <Route path={`${path}/sendMoney`}>
            <SendMoney />
          </Route>
          <Route path={`${path}/`}>
            <History />
          </Route>
        </Switch>
      </Stack.Item>
    </Stack>
  );
};
