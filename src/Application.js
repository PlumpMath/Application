// {{{ Application

/**
 * Special container class for wrapping an application
 *
 * @param    version    application version as string or Version
 */
var Application = function (version) {
  // @hint Version

  if (typeof version === "string") version = (new Version).fromString();
  else this.version = version;
}

/**
 * Application extends Container
 *
 * @see   Container
 */
extend(Container, Application);

// {{{ boot

/**
 * Load application
 */
Application.prototype.boot = function () {
  // bind primitives
  this.bind("Number", Number);
  this.bind("Boolean", Boolean);
  this.bind("String", String);

  // bind custom types
  this.bind("Container", Container);
  this.bind("Comparable", Comparable);
  this.bind("Version", Version);
  this.bind("Application", Application);

  this.version = this.resolve("Version");
}

// }}}
// {{{ shutdown

/**
 * Shutdown application
 */
Application.prototype.shutdown = function () {}

// }}}
// }}}
