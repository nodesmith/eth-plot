import * as React from 'react';
import { createDevTools } from 'redux-devtools';

import reduxDevtoolsDockMonitor from 'redux-devtools-dock-monitor';
import reduxDevtoolsLogMonitor from 'redux-devtools-log-monitor';

const DevTools = createDevTools(
  /**
   * Monitors are individually adjustable via their props.
   * Consult their respective repos for further information.
   * Here, we are placing the LogMonitor within the DockMonitor.
   */
  <DockMonitor toggleVisibilityKey="ctrl-h"
               changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" />
  </DockMonitor>
);

export default DevTools;

/**
 * For further information, please see:
 * https://github.com/gaearon/redux-devtools
 */
