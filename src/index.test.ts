import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { createCounter } from "./app";
import { render } from "./renderer";

const dom = new JSDOM(
  fs.readFileSync(path.join(__dirname, "../index.html")).toString()
);

(global as any).window = dom.window;
(global as any).document = dom.window.document;

const setup = () => {
  const { document } = dom.window;

  return { dom, document };
};

test("it works!", () => {
  const { document } = setup();

  const rootEl = document.getElementById("app");

  if (!rootEl) {
    throw new Error("missing appEl");
  }

  const counter = createCounter();

  render(counter, rootEl);

  counter.actions.increment();
  expect(rootEl?.innerHTML).toEqual("<div>1</div>");
});
