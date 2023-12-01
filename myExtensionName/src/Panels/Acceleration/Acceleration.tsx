import { Immutable, MessageEvent, PanelExtensionContext } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./style.css";

//import PngIcon from "./icons8-acceleration-48.png";

function Acceleration({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();
  // Function to send a signal to the car
  const [buttonColors, setButtonColors] = useState<{ [key: string]: string }>({
    Accelerate_command: "white",
    ADMode_Deactivate_command: "white",
    Decelerate_command: "white",
    break_command: "white",
  });

  const handleClick = (buttonId: string) => {
    // Change the color here
    setButtonColors((prevColors) => ({
      ...prevColors,
      [buttonId]: prevColors[buttonId] === "white" ? "green" : "white",
    }));
  };
  //const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);
      setMessages(renderState.currentFrame);
    };

    context.watch("topics");

    context.watch("currentFrame");

    context.subscribe([{ topic: "/some/topic" }]);
  }, [context]);

  // invoke the done callback once the render is complete //acceleration. Deceleration
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  return (
    <div className="container">
      <div className="acceleration-bar">
        <button
          id="Accelerate_command"
          className="btn btn-accelerate"
          style={{ backgroundColor: buttonColors["Accelerate_command"] }}
          onClick={() => handleClick("Accelerate_command")}
        >
          {/* <img src={PngIcon} style={{ width: "1.5rem", height: "1.5rem" }} /> */}
          Accelerate
        </button>
        <button
          id="Decelerate_command"
          className="btn btn-decelerate"
          style={{ backgroundColor: buttonColors["Decelerate_command"] }}
          onClick={() => handleClick("Decelerate_command")}
        >
          Decelerate
        </button>
      </div>

      <div className="break-section">
        <button
          id="break_command"
          className="btn btn-break"
          style={{ backgroundColor: buttonColors["break_command"] }}
          onClick={() => handleClick("break_command")}
        >
          Break
        </button>
      </div>

      <div>{messages?.length}</div>
    </div>
  );
}

export function initAcceleration(context: PanelExtensionContext): () => void {
  ReactDOM.render(<Acceleration context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
