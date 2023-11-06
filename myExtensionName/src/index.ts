import { ExtensionContext } from "@foxglove/studio";
import { initExamplePanel } from "./ExamplePanel";
import { initCanPanel } from "./Panels/CanPanel/CanPanel";


export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "example-panel", initPanel: initExamplePanel });
  extensionContext.registerPanel({ name: "Can Panel", initPanel: initCanPanel });
}
