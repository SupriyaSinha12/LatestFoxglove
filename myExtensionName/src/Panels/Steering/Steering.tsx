import { Immutable, MessageEvent, PanelExtensionContext, Topic } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";



function Steering({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<Immutable<Topic[]> | undefined>();
  const [currentFrame, setCurrentFrame] = useState<Immutable<MessageEvent[]> | undefined>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();
  let increment_value_L = 0;
  let increment_value_R = 0;

  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);
      setCurrentFrame(renderState.currentFrame);
    };

    context.watch("topics");
    context.watch("currentFrame");

    context.subscribe([{ topic: "/sending_angle" }]);
  }, [context]);

  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  const wheelAngle = currentFrame?.[0]?.messageEvent.message.data;

  const sendSteeringButton = (id: string, currentAngle: number) => {
    let value = id === "LEFT" ? currentAngle + increment_value_L : currentAngle - increment_value_R;
    value *= Math.PI / 180;
    const command_message = `{"data": "STEERING_command:${value}"}`;
    const sending_command = JSON.parse(command_message);
    console.log(sending_command);
  };

  const sendLockButton = () => {
    const button = document.getElementById("WHEEL") as HTMLButtonElement;

    let command_message = '{"data": "WLOCK_command:';

    if (button?.style.background === "rgb(21, 215, 152)") {
      command_message += '0"}';
      button.style.background = "rgb(157,157,157)";
    } else {
      command_message += '1"}';
      button.style.background = "rgb(21, 215, 152)";
    }
    const sending_command = JSON.parse(command_message);
    console.log(sending_command);
  };

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
  return (
    <div>
      <h2>Steering Control</h2>
      <ul className={classes.div}>
        <li className={classes.canvas_main}>
          <div className={classes.title}>Steering Control</div>
          <div className={classes.row}>
            <div className={classes.column_button}>
              <button
                id="LEFT"
                className={classes.button}
                onClick={() => sendSteeringButton("LEFT", wheelAngle)}
              >
                LEFT
              </button>
            </div>
            <div className={classes.column_angle}>
              <div>CURRENT WHEEL ANGLE:</div>
              <div>{`${wheelAngle} °`}</div>
            </div>
            <div className={classes.column_button}>
              <button
                id="RIGHT"
                className={classes.button}
                onClick={() => sendSteeringButton("RIGHT", wheelAngle)}
              >
                RIGHT
              </button>
            </div>
          </div>
          <div className={classes.increment}>
            Increment step:
            <input
              id="INCREMENT"
              type="number"
              onChange={() => changeIncrement(wheelAngle)}
              min="0"
            />
          </div>
        </li>
        <li className={classes.canvas_main}>
          <div className={classes.title}>CAR CONTROL</div>
          <button
            id="WHEEL"
            className={classes.button}
            onClick={() => sendLockButton()}
          >
            Wheel Lock
          </button>
        </li>
      </ul>
    </div>
  );
}

export function initSteering(context: PanelExtensionContext): () => void {
  ReactDOM.render(<Steering context={context} />, context.panelElement);

  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}