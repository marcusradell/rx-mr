import { createCounter } from "./app";
import { render } from "./renderer";

const rootEl = document.getElementById("app");

if (!rootEl) {
  throw new Error("Missing rootEl.");
}

render(createCounter(), rootEl);
