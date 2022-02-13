import React, { useEffect, useState } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import rss from ".";

describe("createProviderAndHook", () => {
  const { useSimpleStore } = rss(0);

  const TestComponent = () => {
    const store = useSimpleStore();
    const [state, setState] = useState(0);

    useEffect(() => {
      store.subscribe(setState);
    }, [store]);

    return (
      <div>
        <button onClick={() => store.update((c) => c + 1)}>inc</button>
        <p>Count: {state}</p>
      </div>
    );
  };

  it("works with the default context", () => {
    let screen = render(<TestComponent />);
    screen.getByText("Count: 0");
    screen.getByRole("button").click();
    screen.getByText("Count: 1");
  });
});
