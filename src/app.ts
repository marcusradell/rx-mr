import { Subject, merge } from "rxjs";
import { startWith, scan, map } from "rxjs/operators";
import { h, Component } from "./renderer";

type Actions = {
  increment: () => void;
  decrement: () => void;
};

type Store = number;

type CreateCounter = () => Component<Actions, Store>;

export const createCounter: CreateCounter = () => {
  const incrementSubject = new Subject<number>();
  const increment = () => incrementSubject.next(1);

  const decrementSubject = new Subject<number>();
  const decrement = () => decrementSubject.next(-1);

  const actions = {
    increment,
    decrement
  };

  const incButtonEl = h("button", {
    on: { click: increment },
    text: "Increment"
  });

  const counterEl = h("span", { text: "" });

  const decButtonEl = h("button", {
    on: { click: decrement },
    text: "Decrement"
  });

  const el = h("div", { children: [decButtonEl, counterEl, incButtonEl] });

  const getView = () => el;

  const storeStream = merge(incrementSubject, decrementSubject).pipe(
    startWith(0),
    scan((store, increment) => store + increment)
  );

  const viewStoreStream = storeStream.pipe(
    map(clicks => {
      counterEl.innerHTML = clicks.toString();
    })
  );

  return {
    actions,
    storeStream,
    viewStoreStream,
    getView
  };
};
