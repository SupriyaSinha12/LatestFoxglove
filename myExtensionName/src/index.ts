import { ExtensionContext } from "@foxglove/studio";
import { initExamplePanel } from "./ExamplePanel";
import { initCarControl } from "./Panels/CarControl/CarControl";
import { initSteering } from "./Panels/Steering/Steering";
import { initCanStatus } from "./Panels/CanStatus/CanStatus";
import { initAcceleration } from "./Panels/Acceleration/Acceleration";
/* import { initSteering1 } from "./Panels/Steering1/Steering1"; */

export function activate(extensionContext: ExtensionContext): void {
  //Registers your extension's panels . The initPanel function accepts a PanelExtensionContext argument, which contains properties and methods for accessing panel data and rendering UI updates
  extensionContext.registerPanel({ name: "example-panel", initPanel: initExamplePanel });
  extensionContext.registerPanel({ name: "Car Control", initPanel: initCarControl });
  extensionContext.registerPanel({ name: "Steering", initPanel: initSteering });
  extensionContext.registerPanel({ name: "Can Status", initPanel: initCanStatus });
  extensionContext.registerPanel({ name: "Acceleration", initPanel: initAcceleration });
  /* extensionContext.registerPanel({ name: "Steering1", initPanel: initSteering1 }) */
}

