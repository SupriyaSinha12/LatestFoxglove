import { ExtensionContext } from "@foxglove/studio";
import { initExamplePanel } from "./ExamplePanel";
import { initCanPanel } from "./Panels/CarControl/CarControl";
import { initSteering } from "./Panels/Steering/Steering";
import { initCanStatus } from "./Panels/CanStatus/CanStatus";

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "example-panel", initPanel: initExamplePanel });
  extensionContext.registerPanel({ name: "Can Panel", initPanel: initCanPanel });
  extensionContext.registerPanel({ name: "Steering Panel", initPanel: initSteering });
  extensionContext.registerPanel({ name: "Can Status Panel", initPanel: initCanStatus });
}
