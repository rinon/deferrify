window.google.sn = 'web';
window.google.timers = {};
window.google.startTick = function (a, b) {
  window.google.timers[a] = {
    t: {
      start: new Date().getTime()
    },
    bfr: !(!b)
  };
};
window.google.tick = function (a, b, c) {
  __called[15] = true;
  if (!window.google.timers[a])
    google.startTick(a);
  window.google.timers[a].t[b] = c || new Date().getTime();
};
google.startTick('load', true);
try {
  window.google.pt = window.gtbExternal && window.gtbExternal.pageT();
} catch (u) {
}
