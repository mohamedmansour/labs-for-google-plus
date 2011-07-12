// Global Settings.
settings = {
  get version() {
    return localStorage['version'];
  },
  set version(val) {
    localStorage['version'] = val;
  },
  get opt_out() {
    var key = localStorage['opt_out'];
    return (typeof key == 'undefined') ? false : key === 'true';
  },
  set opt_out(val) {
    localStorage['opt_out'] = val;
  },
  get modules() {
    var key = localStorage['modules'];
    return (typeof key == 'undefined') ? ['ping'] : key.split(', ');
  },
  set modules(val) {
    if (typeof val == 'object') {
      localStorage['modules'] = val.join(', ');
    }
  }
};