import { Immutable, MessageEvent, PanelExtensionContext } from "@foxglove/studio";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ros1 } from "@foxglove/rosmsg-msgs-common";

import "./style.css";

let wheelAngle: number;

function Steering({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();
  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);

      // currentFrame has messages on subscribed topics since the last render call
      setMessages(renderState.currentFrame);
    };

    context.watch("currentFrame");
    context.subscribe([{ topic: "/sending_commands" }, { topic: "/sending_angle", preload: true }]);
  }, [context]);

  // invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  let increment_value_L = 0;
  let increment_value_R = 0;

  function changeIncrement(current: number) {
    const box = document.getElementById("INCREMENT") as HTMLInputElement;
    const value = box!.value;

    increment_value_R = parseInt(value) + current < -48 ? increment_value_R : parseInt(value);
    console.log("right:", increment_value_R);

    increment_value_L = -parseInt(value) + current > 48 ? increment_value_L : parseInt(value);
    console.log("LEFT: ", increment_value_L);

    box!.max = Math.max(48 - current, 48 + current).toString();
  }

  const callService = useCallback(
    async (id: string, currentAngle: number) => {
      let value =
        id == "LEFT" ? currentAngle + increment_value_L : currentAngle - increment_value_R;
      value *= Math.PI / 180;

      /*  let value1 = id == "LEFT" ? currentAngle + incrementValueL : currentAngle - incrementValueR;
      value *= Math.PI / 180; */

      context.advertise?.("/sending_commands", "std_msgs/String", {
        datatypes: new Map([["std_msgs/String", ros1["std_msgs/String"]]]),
      });

      const command_message = '{"data": "STEERING_command:' + value + '"}';
      const sending_command = JSON.parse(command_message);
      context.publish?.("/sending_commands", sending_command);
    },
    [context.callService],
  );

  /*  const message1: any = messages ? messages[0] : undefined;

  if (message1) {
    /* console.log(message1.message.data); */
  /*     wheelAngle = Math.round(((message1.message.data * 180) / Math.PI) * 10) / 10;
  } */

  useEffect(() => {
    const message1: any = messages ? messages[0] : undefined;
    if (message1) {
      /* console.log(message1.message.data); */
      wheelAngle = Math.round(((message1.message.data * 180) / Math.PI) * 10) / 10;
    }
  }, [messages]);

  return (
    <div>
      <div className="wheel-info">CURRENT WHEEL ANGLE: &ensp; {`${wheelAngle} °`}</div>
      <button
        id="RIGHT"
        className="btn btn-right"
        onClick={async () => {
          callService("RIGHT", wheelAngle);
        }}
      >
        RIGHT
      </button>

      <button
        id="LEFT"
        className="btn btn-left"
        onClick={async () => {
          await callService("LEFT", wheelAngle);
        }}
      >
        LEFT
      </button>
      <div className="increment">
        Increment step:&ensp;
        <input
          id="INCREMENT"
          type="number"
          onChange={() => changeIncrement(wheelAngle)}
          min="0"
        ></input>
      </div>
      <button id="WHEEL" className="btn-wheel">
        Wheel Lock
      </button>
    </div>
  );
}

export function initSteering(context: PanelExtensionContext): () => void {
  // Render the Steering component into the specified panelElement
  ReactDOM.render(<Steering context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    // Unmount (remove) the ExamplePanel component from the panelElement
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
