import { Actions, Store } from "./model";
import { Observable, concat, of } from "rxjs";
import { h } from "../renderer";
import { tap, filter, mapTo } from "rxjs/operators";

export type CreateViewStream = (
  actions: Actions,
  storeStream: Observable<Store>
) => Observable<HTMLElement>;

export const createViewStream: CreateViewStream = (actions, storeStream) => {
  const incButtonEl = h(
    "button",
    {
      on: { click: actions.increment },
      text: "Increment"
    },
    {
      style: "font-size: 2rem; margin: 0.25rem; display: block;"
    }
  );

  const counterEl = h(
    "span",
    {
      text: "-"
    },
    {
      style: "font-size: 2rem; margin: 0.25rem; display: block;"
    }
  );

  const decButtonEl = h(
    "button",
    {
      on: { click: actions.decrement },
      text: "Decrement"
    },
    {
      style: "font-size: 2rem; margin: 0.25rem; display: block;"
    }
  );

  const el = h("div", { children: [incButtonEl, counterEl, decButtonEl] });

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
