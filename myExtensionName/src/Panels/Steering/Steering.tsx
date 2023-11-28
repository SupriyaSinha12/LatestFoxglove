import { Immutable, MessageEvent, PanelExtensionContext, Topic } from "@foxglove/studio";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import { ros1 } from "@foxglove/rosmsg-msgs-common";

//import "./icons8-steering-wheel-60.png";

import "./style.css";

/* export const CUSTOM_METHOD = "custom";
export const PREV_MSG_METHOD = "previous message"; */

function Steering({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();
  const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);

      console.log("renderState", renderState);

      // currentFrame has messages on subscribed topics since the last render call
      //type currtopic = String;

      /* if (renderState.currentFrame && renderState.currentFrame.length > 0) {
        setMessages(renderState.currentFrame[renderState.currentFrame.length - 1] as currtopic);
      } */

      setMessages(renderState.currentFrame);
    };

    context.watch("topics");
    context.watch("currentFrame");
    context.watch("allFrames");

    context.subscribe([{ topic: "/sending_commands", preload: true }]);

    // console.log("testing publish", context.publish);
  }, [context]);

  // invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  const increment_value_L = 0;
  const increment_value_R = 0;
  let wheelAngle = 50;
  let tempvalue: number = 0;

  /*   const sendLockButton = useCallback(
    async (id: string) => {
      context.advertise?.("/sending_commands", "std_msgs/String", {
        datatypes: new Map([["std_msgs/String", ros1["std_msgs/String"]]]),
      });

      const command_message = '{"data": "WLOCK_command:';
      const sending_command = JSON.parse(command_message);
      context.publish?.("/sending_commands", sending_command);
    },
    [context.sendLockButton],
  ); */

  const callService = useCallback(
    async (id: string, currentAngle: number) => {
      /*   console.log("Current Message", messages);
      console.log("Current Topics", messages); */

      /* const allframes = context.subscribe([{ topic: "/sending_commands" }]);

      console.log("context.watch currentFrame", allframes); */

      let value =
        id == "LEFT" ? currentAngle + increment_value_L : currentAngle - increment_value_R;
      value *= Math.PI / 180;
      console.log("currentAngle", currentAngle);
      tempvalue += 1;

      console.log("tempvalue", tempvalue);
      context.advertise?.("/sending_commands", "std_msgs/String", {
        datatypes: new Map([["std_msgs/String", ros1["std_msgs/String"]]]),
      });

      const command_message2 = '{"data": "STEERING_command:' + tempvalue + '"}';
      const sending_command2 = JSON.parse(command_message2);
      context.publish?.("/sending_commands", sending_command2);
    },
    [context.callService],
  );

  return (
    <div>
      <div className="wheel-info">CURRENT WHEEL ANGLE: &ensp; {`${wheelAngle} °`}</div>
      {/*  <div>
      <image src="icons8-steering-wheel-60.png" alt="steering wheel" width="500" height="600"> 
      </div> */}
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
        <input id="INCREMENT" type="number" min="0"></input>
      </div>
      <button
        id="WHEEL"
        className="btn-wheel"
        /*  onClick={async () => {
          sendLockButton("RIGHT", wheelAngle);
        }} */
      >
        Wheel Lock
      </button>

      <div>
        {(topics ?? []).map((topic) => (
          <>
            <div key={topic.name}>{topic.name}</div>
          </>
        ))}
      </div>
      <div>{messages?.length}</div>
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
