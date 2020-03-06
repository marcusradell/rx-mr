import { Observable } from "rxjs";

export type Component<TActions, TStore> = {
  actions: TActions;
  getView: () => HTMLElement;
  storeStream: Observable<TStore>;
  viewStoreStream: Observable<unknown>;
};

type Render = (c: Component<unknown, unknown>, parentEl: HTMLElement) => void;

export const render: Render = (c, parentEl) => {
  parentEl.innerHTML = "";
  parentEl.appendChild(c.getView());
  c.viewStoreStream.subscribe({
    error: error => {
      // TODO: Test this.
      throw error;
    }
  });
};

type GetElementById = (id: string) => HTMLElement;

export const getElementById: GetElementById = id => {
  const el = document.getElementById(id);

  if (!el) {
    throw new Error(`Missing required element ID: ${id}.`);
  }

  return el;
};

type H = (tag: string) => HTMLElement;

export const h: H = tag => document.createElement(tag);
