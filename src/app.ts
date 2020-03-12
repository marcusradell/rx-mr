import { Subject, merge, concat, of } from "rxjs";
import {
  startWith,
  scan,
  tap,
  shareReplay,
  filter,
  mapTo
} from "rxjs/operators";
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

  const getViewStream = () => {
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

    return concat(
      of(el),
      storeStream.pipe(
        tap(clicks => {
          counterEl.innerHTML = clicks.toString();
        }),
        filter(() => false),
        // Not needed since we filter everything out, but fixes typescript type error.
        mapTo(el)
      )
    );
  };

  const storeStream = merge(incrementSubject, decrementSubject).pipe(
    startWith(0),
    scan((store, increment) => store + increment),
    shareReplay(1)
  );

  return {
    actions,
    storeStream,
    getViewStream
  };
};
