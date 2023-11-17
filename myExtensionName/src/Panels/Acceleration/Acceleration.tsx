import { Immutable,PanelExtensionContext, Topic } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import './style.css';

function Acceleration({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();

  // Function to send a signal to the car
  const [buttonColor, setButtonColor] = useState('white');

  const handleClick = () => {
    // Change the color here
    setButtonColor('green');
  };
  //const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();
 

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
  useLayoutEffect(() => {

    context.onRender = (renderState, done) => {
    
      setRenderDone(() => done);

      setTopics(renderState.topics);

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
        <button id="Accelerate_command" className="btn btn-accelerate" style={{ backgroundColor: buttonColor }} onClick={handleClick}>Accelerate</button>
        <button id="Decelerate_command" className="btn btn-decelerate" style={{ backgroundColor: buttonColor }} onClick={handleClick}>Decelerate</button>
    </div>
          
    <div className="break-section">
          <button id="break_command" className="btn btn-break" style={{ backgroundColor: buttonColor }} onClick={handleClick}>Break</button>
    </div>
       
  
    <div>
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

export function initAcceleration(context: PanelExtensionContext): () => void {
  ReactDOM.render(<Acceleration context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
