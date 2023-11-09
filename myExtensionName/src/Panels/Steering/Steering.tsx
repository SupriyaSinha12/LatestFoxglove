import { Immutable, PanelExtensionContext, Topic } from "@foxglove/studio";
import { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import './style.css';

function Steering({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [topics, setTopics] = useState<Immutable<Topic[]> | undefined>();
 // const [messages, setMessages] = useState<undefined | Immutable<MessageEvent[]>>();

  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

  //const classes = useStyles();
  
  useLayoutEffect(() => {
    context.onRender = (renderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);
      //setMessages(renderState.currentFrame);
    };

    context.watch("topics");
    context.watch("currentFrame");

    context.subscribe([{ topic: "/sending_angle" }]);
  }, [context]);

  useEffect(() => {
    renderDone?.();
  }, [renderDone]);


   return (
     <div> 
     {/* <h2 className="title">STEERING CONTROL</h2> */}
       
           <div >
             <button id="LEFT"  >LEFT</button>
             <button id="RIGHT" >RIGHT</button><br></br>
          </div>
          <div className="increment">
            Increment step:&ensp;
          <input id="INCREMENT" type="number" min="0"></input>
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

export function initSteering(context: PanelExtensionContext): () => void {
  ReactDOM.render(<Steering context={context} />, context.panelElement);

  return () => {
    ReactDOM.unmountComponentAtNode(context.panelElement);
  };
}