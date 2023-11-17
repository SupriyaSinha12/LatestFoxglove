import { Immutable, MessageEvent, PanelExtensionContext, Topic } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ros1 } from "@foxglove/rosmsg-msgs-common";
import { PanelConfig } from "../..";
import { CompressedImage } from "@foxglove/schemas";

import './style.css';

export const CUSTOM_METHOD = "custom";
export const PREV_MSG_METHOD = "previous message";

const PanelConfig = {
  diffEnabled: false,
  diffMethod: CUSTOM_METHOD,
  topicPath: "/sending_angle",
};

let increment_value_L = 0;
let increment_value_R = 0;

function changeIncrement(current: number) {
  const box = document.getElementById("INCREMENT") as HTMLInputElement;
  const value = box!.value;

  const left = document.getElementById("LEFT");
  const right = document.getElementById("RIGHT");

  increment_value_R = parseInt(value) + current < -48 ? increment_value_R : parseInt(value);
  right!.innerText = "RIGHT " + increment_value_R;

  increment_value_L = -parseInt(value) + current > 48 ? increment_value_L : parseInt(value);
  left!.innerText = "LEFT " + increment_value_L;

  box!.max = Math.max(48 - current, 48 + current).toString();
}

function sendSteeringButton(id: string, currentAngle: number, publisher: any) {
  // Calculate the new steering angle based on the button ID ('LEFT' or 'RIGHT')
  let value = id == "LEFT" ? currentAngle + increment_value_L : currentAngle - increment_value_R;

  // Convert the angle from degrees to radians
  value *= Math.PI / 180;

  // Create a command messaimport { CompressedImage } from "@foxglove/schemas";
function sendLockButton(id: string, publisher: any) {
  const button = document.getElementById("WHEEL") as HTMLButtonElement;

  let command_message = '{"data": "WLOCK_command:';

  if (button?.style.background == "rgb(21, 215, 152)") {
    command_message += '0"}';
    button!.style.background = "rgb(157,157,157)";
  }
  else {
    command_message += '1"}';
    button!.style.background = "rgb(21, 215, 152)";
  }
  const sending_command = JSON.parse(command_message);
  console.log(sending_command);
  publisher(sending_command as Record<string, unknown>);
}
}

function Steering({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<Immutable<Topic[]> | undefined>();
  const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();


 // const message = baseItem?.MessageEvent.message
  //let wheelAngle = Math.round(message?.data * 180 / Math.PI * 10) / 10;
  let wheelAngle = 0;
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);

         // Save the most recent message on our image topic.
         if (renderState.currentFrame && renderState.currentFrame.length > 0) {
            setMessages(renderState.currentFrame[renderState.currentFrame.length - 1] as ImageMessage);
             /* setMessages(renderState.currentFrame);  */
         }
    };

    context.watch("topics");
    context.watch("currentFrame");

    /* context.subscribe([{ topic: "/sending_angle" }]); */

 //indicate an intent to publish a specific datatype on a topic. A panel must call context.advertise before being able to publish on the topic (context.publish).
    context.advertise?.("/sending_commands", "sensor_msgs/Joy", {
      datatypes: new Map([
        ["std_msgs/Header", ros1["std_msgs/Header"]],
        ["std_msgs/Float32", ros1["std_msgs/Float32"]],
        ["std_msgs/Int32", ros1["std_msgs/Int32"]],
        ["sensor_msgs/Joy", ros1["sensor_msgs/Joy"]],
      ]),
    });

     

  }, [context]);

  useEffect(() => {
    renderDone?.();
  }, [renderDone]);


   return (
     <div> 
          <div className="wheel-info">CURRENT WHEEL ANGLE:   &ensp; </div>
          <div className="steering-btn">
          {/*    <button id="LEFT" className="btn btn-left" >LEFT</button>
             <button id="RIGHT" className="btn btn-right" >RIGHT</button> */}
             <button id="LEFT" className="btn btn-left" onClick={()=>sendSteeringButton("LEFT", wheelAngle, CommandPublisher)}>LEFT</button>
             <button id="RIGHT" className="btn btn-right" onClick={()=>sendSteeringButton("RIGHT", wheelAngle, CommandPublisher)}>RIGHT</button>
          </div>
          <div className="increment">
            Increment step:&ensp;
          <input id="INCREMENT" type="number" onChange={()=>changeIncrement(wheelAngle)} min="0"></input>
           </div>
          <button id="WHEEL" className="btn-wheel" onClick={()=>sendLockButton("WHEEL", CommandPublisher)}>Wheel Lock</button>
    
       <div >
         {(topics ?? []).map((topic) => (
           <>
             <div key={topic.name}>{topic.name}</div>
             <div key={topic.datatype}>{topic.datatype}</div>
           </>
         ))}
       </div>

     </div>
  );
}

export function initSteering(context: PanelExtensionContext): () => void {
  ReactDOM.render(<Steering context={context} />, context.panelElement);

  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}