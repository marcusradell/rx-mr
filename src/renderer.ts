import { Observable } from "rxjs";

export type Component = {
  actions: any; // TODO
  getView: () => HTMLElement;
  storeStream: Observable<unknown>;
};

export const render = (c: Component, parentEl: HTMLElement) => {
  parentEl.innerHTML = "";
  parentEl.appendChild(c.getView());
  c.storeStream.forEach(el => {});
};

type H = (tag: string) => HTMLElement;

export const h: H = tag => document.createElement(tag);
