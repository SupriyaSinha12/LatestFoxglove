import { Immutable,PanelExtensionContext, Topic } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import './style.css';

function CarControl({ context }: { context: PanelExtensionContext }): JSX.Element {
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

  // invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  return (
<div className="container">
    <div className="top-bar">
        <button id="VIM_command" className="btn-power">POWER</button>
        <select id="VEHOP_command" className="vehop-mode">
          <option value="0">No Request</option>
          <option value="1">No Vehicle Operator Mode</option>
          <option value="2">Vehicle Operator Mode</option>
        </select>
    </div>
          
    <div className="btn-section">
          <button id="ADMode_command" className="btn btn-AD" style={{ backgroundColor: buttonColor }} onClick={handleClick}>Activate AD-MODE</button>
          <button id="ADMode_command" className="btn btn-AD" style={{ backgroundColor: buttonColor }} onClick={handleClick}>Deactivate AD-MODE</button>
          <button id="Horn_command" className="btn btn-horn" style={{ backgroundColor: buttonColor }} onClick={handleClick}>Horn</button>
          <button id="HL_command" className="btn btn-HL" style={{ backgroundColor: buttonColor }} onClick={handleClick}>HAZARD LIGHT</button>
          <button id="HL_command" className="btn btn-rlane" style={{ backgroundColor: buttonColor }} onClick={handleClick}>Right Lane</button>
          <button id="HL_command" className="btn btn-llane" style={{ backgroundColor: buttonColor }} onClick={handleClick}>Left Lane</button>
         
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

export function initCarControl(context: PanelExtensionContext): () => void {
  ReactDOM.render(<CarControl context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
