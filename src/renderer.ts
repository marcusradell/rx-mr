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

type HEvents = { click: () => void };

type HBaseContent = { on?: HEvents };

type HLeafContent = HBaseContent & { text: string };

type HLeaf = (el: HTMLElement, content: HLeafContent) => HTMLElement;

const hLeaf: HLeaf = (el, content) => {
  el.textContent = content.text;
  return el;
};

type HNodeContent = HBaseContent & { children: HTMLElement[] };

type HNode = (el: HTMLElement, content: HNodeContent) => HTMLElement;

const hNode: HNode = (el, content) => {
  content.children.forEach(c => el.appendChild(c));
  return el;
};

type HContent = HLeafContent | HNodeContent;

type H = (tag: string, content: HContent) => HTMLElement;

export const h: H = (tag, content) => {
  const el = document.createElement(tag);

  if (content.on !== undefined) {
    // TODO: TypeScript doesn't get what type the keys are *AND* it forgets that content.on is not undefined. Sigh.
    Object.keys(content.on).forEach(eventName =>
      el.addEventListener(
        eventName as keyof HEvents,
        (content.on as HEvents)[eventName as keyof HEvents],
        false
      )
    );
  }

  // TODO: Figure out why doesn't typescript get the type and fix it.
  if (content.hasOwnProperty("text")) {
    return hLeaf(el, content as HLeafContent);
  }

  return hNode(el, content as HNodeContent);
};
