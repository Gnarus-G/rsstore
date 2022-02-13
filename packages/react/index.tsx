import React, { createContext, ReactNode, useContext } from "react";
import { createStore } from "@rsstore/core";

/**
 * Creates a React context provider, and inject any initial state for created store;
 * @param initialState of the store
 * @returns a provider, and a custom hook to use the store in components
 */
export default function rss<T>(initialState: T) {
  const context = createContext({
    store: createStore(initialState),
  });

  return {
    SimpleStoreProvider({
      initialState,
      children,
    }: {
      initialState: T;
      children: ReactNode;
    }) {
      return (
        <context.Provider
          value={{
            store: createStore(initialState),
          }}
        >
          {children}
        </context.Provider>
      );
    },
    useSimpleStore: () => {
      return useContext(context).store;
    },
  };
}
