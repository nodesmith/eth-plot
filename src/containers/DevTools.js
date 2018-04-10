import * as React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
var DevTools = createDevTools(
/**
 * Monitors are individually adjustable via their props.
 * Consult their respective repos for further information.
 * Here, we are placing the LogMonitor within the DockMonitor.
 */
React.createElement(DockMonitor, { toggleVisibilityKey: "ctrl-h", changePositionKey: "ctrl-q" },
    React.createElement(LogMonitor, { theme: "tomorrow" })));
export default DevTools;
/**
 * For further information, please see:
 * https://github.com/gaearon/redux-devtools
 */
//# sourceMappingURL=DevTools.js.map