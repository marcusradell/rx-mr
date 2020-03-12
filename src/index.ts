import { createCounter } from "./counter";
import { render, getElementById } from "./renderer";

const rootEl = getElementById("root");

const counter = createCounter();

(window as any).app = counter;

render(counter, rootEl);
