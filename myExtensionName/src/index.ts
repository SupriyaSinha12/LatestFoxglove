import { ExtensionContext } from "@foxglove/studio";
import { initExamplePanel } from "./ExamplePanel";
import { initCanPanel } from "./Panels/CanPanel/CanPanel";
import { initSteering } from "./Panels/Steering/Steering";

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "example-panel", initPanel: initExamplePanel });
  extensionContext.registerPanel({ name: "Can Panel", initPanel: initCanPanel });
  extensionContext.registerPanel({ name: "Steering Panel", initPanel: initSteering });
}
