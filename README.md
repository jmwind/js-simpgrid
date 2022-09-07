Simple resizable and moveable grid for dashboards. Mostly CSS, not much fluff.

TODOs.

- [] Bug on move as span is allocated to index in grid and transfers to moved section
- [] persist dash state and reload 
- [] add concept of layouts -> [metrics] and switching and persist
- [] adding new metric type not requiring changes to demo
- [] proptypes, typescript?
- [] graph plot of metric over time
- [] storage or metric history and sampling when time period is long (1min, 5min, 15min, 1 hour, 6 hours)
- [] number metric resize based on parent size as a % (has to by in js by grabbing parent ref and width/height)
- [] verify how minimum size of metrics cause resize issues (can't resize smaller than size)
- [] verify all callbacks and listeners... leaking?