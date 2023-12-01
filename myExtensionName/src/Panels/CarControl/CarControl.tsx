import { Immutable, MessageEvent, PanelExtensionContext } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./style.css";

function CarControl({ context }: { context: PanelExtensionContext }): JSX.Element {
  // Function to send a signal to the car
  const [buttonColors, setButtonColors] = useState<{ [key: string]: string }>({
    ADMode_command: "white",
    ADMode_Deactivate_command: "white",
    Horn_command: "white",
    HL_command: "white",
    RL_command: "white",
    LL_command: "white",
    VIM_command: "white",
  });

  const handleClick = (buttonId: string) => {
    // Change the color here
    setButtonColors((prevColors) => ({
      ...prevColors,
      [buttonId]: prevColors[buttonId] === "white" ? "green" : "white",
    }));
  };
  const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);

      setMessages(renderState.currentFrame);
    };

    context.watch("currentFrame");

    context.subscribe([{ topic: "/some/topic" }]);
  }, [context]);

  // invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  return (
    <div className="container">
      <div className="top-bar">
        <button
          id="VIM_command"
          className="btn-power"
          style={{ backgroundColor: buttonColors["VIM_command"] }}
          onClick={() => handleClick("VIM_command")}
        >
          POWER
        </button>
        <select id="VEHOP_command" className="vehop-mode">
          <option value="0">No Request</option>
          <option value="1">No Vehicle Operator Mode</option>
          <option value="2">Vehicle Operator Mode</option>
        </select>
      </div>

      <div className="btn-section">
        <button
          id="ADMode_command"
          className="btn btn-AD"
          style={{ backgroundColor: buttonColors["ADMode_command"] }}
          onClick={() => handleClick("ADMode_command")}
        >
          Activate AD-MODE
        </button>
        <button
          id="ADMode_Deactivate_command"
          className="btn btn-AD"
          style={{ backgroundColor: buttonColors["ADMode_Deactivate_command"] }}
          onClick={() => handleClick("ADMode_Deactivate_command")}
        >
          Deactivate AD-MODE
        </button>
        <button
          id="Horn_command"
          className="btn btn-horn"
          style={{ backgroundColor: buttonColors["Horn_command"] }}
          onClick={() => handleClick("Horn_command")}
        >
          Horn
        </button>
        <button
          id="HL_command"
          className="btn btn-HL"
          style={{ backgroundColor: buttonColors["HL_command"] }}
          onClick={() => handleClick("HL_command")}
        >
          HAZARD LIGHT
        </button>
        <button
          id="RL_command"
          className="btn btn-rlane"
          style={{ backgroundColor: buttonColors["RL_command"] }}
          onClick={() => handleClick("RL_command")}
        >
          Right Lane
        </button>
        <button
          id="LL_command"
          className="btn btn-llane"
          style={{ backgroundColor: buttonColors["LL_command"] }}
          onClick={() => handleClick("LL_command")}
        >
          Left Lane
        </button>
      </div>

      <div>{messages?.length}</div>
    </div>
  );
}

export function initCarControl(context: PanelExtensionContext): () => void {
  ReactDOM.render(<CarControl context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
