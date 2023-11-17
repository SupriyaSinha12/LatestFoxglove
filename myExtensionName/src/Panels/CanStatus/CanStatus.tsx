import { Immutable, PanelExtensionContext, Topic } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import './/style.css';

function CanStatus({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<undefined | Immutable<Topic[]>>();
  //const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
  useLayoutEffect(() => {
    
    context.onRender = (renderState, done) => {
           // Set the done callback into a state variable to trigger a re-render.
      setRenderDone(() => done);

      // We may have new topics - since we are also watching for messages in the current frame, topics may not have changed
      // It is up to you to determine the correct action when state has not changed.
      setTopics(renderState.topics);

      // currentFrame has messages on subscribed topics since the last render call
     // setMessages(renderState.currentFrame);
    };


    // tell the panel context that we care about any update to the _topic_ field of RenderState
    context.watch("topics");

    // tell the panel context we want messages for the current frame for topics we've subscribed to
    // This corresponds to the _currentFrame_ field of render state.
    context.watch("currentFrame");

    // subscribe to some topics, you could do this within other effects, based on input fields, etc
    // Once you subscribe to topics, currentFrame will contain message events from those topics (assuming there are messages).
    context.subscribe([{ topic: "/some/topic" }]);
  }, [context]);

  // invoke the done callback once the render is complete
  useEffect(() => {
    renderDone?.();
  }, [renderDone]);

  return (
    <div className="container"  >
            <div className="canstatus">
                  <div id="ADMode_Act" className="status status1"><span className="dot"></span>
                        AD-Mode Status 
                  </div>
                  <div id="ADMode_Status" className="status status2" ><span className="dot"></span>
                        Ready to AD-Mode
                  </div>
                  <div id="Steering_DS" className="status status3"><span className="dot"></span>
                        Steering Degraded
                  </div> 
                  <div id="Steering_RDS" className="status status4"><span className="dot"></span>
                        Redundant Steering Degraded
                  </div>
                  <div id="Brake_DS" className="status status5"><span className="dot"></span>
                        Brake Degraded
                  </div>
                  <div id="Brake_RDS" className="status status6"><span className="dot"></span>
                        Redundant Brake Degraded
                  </div>
                  <div id="SSM_DS"  className="status status7"><span className="dot"></span>
                        SSM Degraded
                  </div>
                 <div id="SSMB_DS" className="status status8" ><span className="dot"></span>
                        SSMB Degraded
                  </div>
                  <div id="PrimaryVolt_S" className="status status9"><span className="dot"></span>
                        Primary 12-Volt Side
                  </div>
                  <div id="SecondaryVolt_S" className="status status10"><span className="dot"></span>
                        Secondary 12-Volt Side
                  </div>
                  <div id="EPB_S" className="status status11"><span className="dot"></span>
                        P-lock & EPB Capability
                  </div>
                  <div id="SEPB_S" className="status status12"><span className="dot"></span>
                        P-lock & EPB Capability
                  </div>
                  <div id="DriverPr" className="status status13"><span className="dot"></span>
                        Driver Present
                  </div>
                  <div id="DriverPrQF" className="status status14"><span className="dot"></span>
                        Driver Present Qf
                  </div>
            </div>            
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

export function initCanStatus(context: PanelExtensionContext): () => void {
  ReactDOM.render(<CanStatus context={context} />, context.panelElement);

  // Return a function to run when the panel is removed
  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}
