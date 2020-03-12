import { Component } from "../renderer";
import { Observable, Subject, merge } from "rxjs";
import { startWith, scan, shareReplay } from "rxjs/operators";

export type Actions = {
  increment: () => void;
  decrement: () => void;
};

export type Store = number;

type Model = {
  actions: Actions;
  storeStream: Observable<Store>;
};

type CreateModel = () => Model;

export const createModel: CreateModel = () => {
  const incrementSubject = new Subject<number>();
  const increment = () => incrementSubject.next(1);

  const decrementSubject = new Subject<number>();
  const decrement = () => decrementSubject.next(-1);

  const actions = {
    increment,
    decrement
  };

  const storeStream = merge(incrementSubject, decrementSubject).pipe(
    startWith(0),
    scan((store, increment) => store + increment),
    shareReplay(1)
  );

  return {
    actions,
    storeStream
  };
};
