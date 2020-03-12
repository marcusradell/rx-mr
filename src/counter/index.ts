import { Component } from "../renderer";
import { Actions, Store, createModel } from "./model";
import { createViewStream } from "./view_stream";

type CreateCounter = () => Component<Actions, Store>;

export const createCounter: CreateCounter = () => {
  const { actions, storeStream } = createModel();

  const viewStream = createViewStream(actions, storeStream);

  return {
    actions,
    storeStream,
    viewStream
  };
};
