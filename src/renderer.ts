import { Observable } from "rxjs";

export type Component<TActions, TStore> = {
  actions: TActions;
  viewStream: Observable<HTMLElement>;
  storeStream: Observable<TStore>;
};

type Render = (c: Component<unknown, unknown>, parentEl: HTMLElement) => void;

export const render: Render = (c, parentEl) => {
  c.viewStream.forEach(el => {
    parentEl.innerHTML = "";
    parentEl.appendChild(el);
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

type H = (
  tag: string,
  content: HContent,
  attrs?: { [s: string]: string }
) => HTMLElement;

export const h: H = (tag, content, attrs) => {
  const el = document.createElement(tag);

  const events = content.on;

  if (events !== undefined) {
    ((Object.keys(events) as unknown) as (keyof HEvents)[]).forEach(eventName =>
      el.addEventListener(eventName, events[eventName], false)
    );
  }

  if (attrs) {
    Object.keys(attrs).forEach(attr => el.setAttribute(attr, attrs[attr]));
  }

  if ("text" in content) {
    return hLeaf(el, content);
  }

  return hNode(el, content);
};
