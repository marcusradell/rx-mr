import { createCounter } from "./app";
import { render, getElementById } from "./renderer";

const rootEl = getElementById("root");
render(createCounter(), rootEl);
