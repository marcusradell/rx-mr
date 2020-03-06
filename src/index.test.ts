import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { createCounter } from "./app";
import { render, getElementById } from "./renderer";

const dom = new JSDOM(
  fs.readFileSync(path.join(__dirname, "../index.html")).toString()
);

(global as any).window = dom.window;
(global as any).document = dom.window.document;

test("it works!", () => {
  const counter = createCounter();
  const rootEl = getElementById("root");
  render(counter, rootEl);

  counter.actions.increment();

  expect(rootEl.innerHTML).toEqual(
    "<div><button>Inc</button><span>1</span><button>Dec</button></div>"
  );
});
