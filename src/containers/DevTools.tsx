import * as React from 'react';
import { createDevTools } from 'redux-devtools';

import DockMonitor from 'redux-devtools-dock-monitor';
import LogMonitor from 'redux-devtools-log-monitor';

const devTools = createDevTools(
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

export default devTools;

/**
 * For further information, please see:
 * https://github.com/gaearon/redux-devtools
 */
