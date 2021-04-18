import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { mergeStyles } from "@fluentui/react";
import reportWebVitals from "./reportWebVitals";
import Notification from "./helpers/notifications";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./index.css";
// Inject some global styles
mergeStyles({
  ":global(body,html,#root)": {
    margin: 0,
    padding: 0,
    height: "100vh",
  },
});
const stripePromise = loadStripe(
  "pk_test_51IhI4wFiEeqrout7JsVqFVH8KT0CwcJ7sYL3x9tgs7PW37CTYpvnrdxMnVo89Payh0b9So4wHqldBxszsSJktR4E00gUFm9qqt"
);

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <App />
    <Notification />
  </Elements>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
