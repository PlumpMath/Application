(function (outside) {

  var metadata = {
    "title": "Application IoC Container",
    "description": "A wrapper for javascript applications",
    "version": "0.1.0",
    "author": {
      "name": "William Stein",
      "email": "williamstein92@gmail.com",
      "url": "https://github.com/williamstein92"
    }
  }

  // {{{ extend

  /**
   * Extends a child class from a parent class
   *
   * @param   parent    the parent class
   * @param   child     the child class
   * @return            the extended class
   */
  function extend(parent, child) {
    // {{{ Surrogate

    /**
     * Allows inheritance without calling the parent's constructor
     */
    var Surrogate = function () {};
    Surrogate.prototype = parent.prototype;

    // }}}

    child.prototype = new Surrogate();
    child.prototype.constructor = child;

    // preserve a reference to the parent
    child.parent = parent.prototype;

    return child;
  }

  // }}}
  // {{{ Container

  /**
   * Container is an IoC class.
   */
  var Container = function () {}

  Container.prototype = new function () {
    // The object bin is kept "private"
    var bin = {
      "aliases": {},
      "specific": {},
      "general": {}
    },
    container = this;

    // {{{ alias

    /**
     * Aliases a stored object
     *
     * @param   name      alias
     * @param   abstract  object to alias
     */

    // {{{ bind

    /**
     * Binds a class
     *
     * @param   name      name to store class by
     * @param   abstract  class constructor
     */

    // {{{ store

    /**
     * Stores an instance
     *
     * @param   name      name to store instance by
     * @param   abstract  instance
     */

    // strap alias, bind & store onto container

    var methods = {
      "alias": "aliases",
      "store": "specific",
      "bind": "general"
    };

    for (method in methods) {
      container[method] = function (section) {
        // this is the actual function that becomes alias/bind/store
        return function (name, abstract) {
          bin[section][name] = abstract;
        }
      }(methods[method]);
    }

    // }}}
    // }}}
    // }}}
    // {{{ resolve

    /**
     * Resolves a class from the container
     *
     * @param   name    could be an alias, instance, or class
     * @return          instance that corresponds to name
     */
    container.resolve = function (name) {
      var dependencies;

      // if the name is an alias, get the real name
      name = (bin.aliases[name]) ? bin.aliases[name] : name;

      // if name references an instance
      if (bin.specific[name]) return bin.specific[name];

      // if name references a class
      if (bin.general[name]) {
        // and build an instance with dependencies
        return this.injectDependencies(bin.general[name]);
      }
    };

    // }}}
    // {{{ readDependencies

    /**
     * Determines a function's dependencies
     *
     * @param   func    function to extract dependencies from
     * @return          array of dependency names
     */
    container.readDependencies = function (func) {
      // turn the function into a string, and extract typehint comments
      var typehints = func.toString().match(/@hint\s+(.*)/g);

      // if there aren't any hints, there are no dependencies
      if (typehints == null) return null;

      // if there's more than one typehint, make them a string
      // otherwise, get the one & only typehint
      typehints = (typehints.length > 1) ? typehints.join(".") : typehints[0];

      // strip the typehints down to just object names,
      // and turn typehints back into an array
      typehints = typehints.replace(/@hint\s+/g, '').split(".");

      return typehints;
    }

    // }}}
    // {{{ injectDependencies

    /**
     * Determines a function's dependencies and injects them
     *
     * @param   constructor   dependencies are built for this object
     * @return                instance
     */
    container.injectDependencies = function (constructor) {
      var dependencies = this.readDependencies(constructor),
          dependency_number = (dependencies) ? dependencies.length : 0,
          argv = [];

      if (dependencies) {
        for (i = 0; i < dependency_number; i++) {
          argv[i] = this.resolve(dependencies[i]);
        }
      }

      return this.buildWithArguments(constructor, argv);
    };

    // }}}
    // {{{ buildWithArguments

    /**
     * Builds an instance from constructor, and passes arbitrary arguments
     *
     * @param   constructor   constructor for instance
     * @param   argv           arguments for constructor
     * @return                built instance
     */
    container.buildWithArguments = function (constructor, argv) {
      if (argv) argv.unshift(null);
      return new (Function.prototype.bind.apply(constructor, argv));
    }

    // }}}
  };

  // }}}
  // {{{ Comparable

  /**
   * Comparable is the abstract base class for comparability.
   * A class should extend Comparable if it needs to be compared to others
   * of its same class.
   */
  var Comparable = function () {};

  // {{{ compare

  /**
   * Compares <code>this</code> and <code>other</code>.
   * If <code>this > other</code>, the method will return 1;
   * if <code>this < other</code>, the method will return -1;
   * if <code>this === other</code>, the method will return 0.
   *
   * @param   other   the object to compare with
   * @return          1 if >, -1 if < and 0 if ===
   */
  Comparable.prototype.compare = function (other) {};


  // }}}
  // {{{ isGreaterThan

  /**
   * Check if <code>this > other</code>.
   * The method will return <code>true</code> if <code>this > other</code>
   * and <code>false</code> otherwise.
   *
   * @param   other   the object to compare with
   * @return          true if >, otherwise false
   */
  Comparable.prototype.isGreaterThan = function (other) {
    return this.compare(other) > 0;
  };

  // }}}
  // {{{ isLessThan

  /**
   * Check if <code>this < other</code>.
   * The method will return <code>true</code> if <code>this < other</code>
   * and <code>false</code> otherwise.
   *
   * @param   other   the object to compare with
   * @return          true if <, otherwise false
   */
  Comparable.prototype.isLessThan = function (other) {
    return this.compare(other) < 0;
  };

  // }}}
  // {{{ isEqualTo

  /**
   * Check if <code>this === other</code>.
   * The method will return <code>true</code> if <code>this === other</code>
   * and <code>false</code> otherwise.
   *
   * @param   other   the object to compare with
   * @return          true if ===, otherwise false
   */
  Comparable.prototype.isEqualTo = function (other) {
    return this.compare(other) === 0;
  };

  // }}}
  // }}}
  // {{{ Version

  /**
   * Version is a class to store version numbers
   *
   * @param   major   major number
   * @param   minor   minor number
   * @param   patch   patch number
   */
  var Version = function (major, minor, patch) {
    // @hint Number
    // @hint Number
    // @hint Number

    this.major = major;
    this.minor = minor;
    this.patch = patch;
  };

  /**
   * Version extends Comparable
   *
   * @see   Comparable
   */
  extend(Comparable, Version);

  // {{{ compare

  /**
   * Overrides abstract method compare, from Comparable
   *
   * @see   Comparable#compare
   */
  Version.prototype.compare = function (version) {
    var a = [this.major, this.minor, this.patch],
        b = [version.major, version.minor, version.patch];

    // compare major first, then minor, then patch
    for (i = 0; i < 3; i++) {
      // this version is larger than the other
      if (a[i] > b[i]) return 1;
      // this version is smaller than the other
      if (a[i] < b[i]) return -1;
    }

    // the versions are equal
    return 0;
  }

  // }}}
  // {{{ toString

  /**
   * Builds string from Version
   *
   * @return          [major].[minor].[patch]
   */
  Version.prototype.toString = function () {
    return this.major + "." + this.minor + "." + this.patch;
  };

  // }}}
  // {{{ fromString

  /**
   * Builds Version from string
   *
   * @param   str     String in format, [major].[minor].[patch]
   * @return          <code>true</code> if successful, otherwise false
   */
  Version.prototype.fromString = function (str) {
    str = str.split(".");

    // if str is not in the correct format, false
    if (str.length < 3) return false;

    this.major = +str[0];
    this.minor = +str[1];
    this.patch = +str[2];

    return true;
  };

  // }}}
  // }}}
  // {{{ Application

  /**
   * Special container class for wrapping an application
   *
   * @param    version    application version as string or Version
   */
  var Application = function (version) {
    // @hint Version

    if (typeof version === "string") this.version = (new Version).fromString();
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

  // miscellaneous startup

  var app = new Application;

  app.boot();

  // set the version
  app.version.fromString(metadata.version);

  // if outside this closure there is no app,
  // or there is, and it has a smaller version than this one
  if ( ! outside.app
      || (outside.app instanceof Application
          && outside.app.version < app.version)) {
    outside.app = app;
  }

  // and the same for williamstein92.Application
  if ( ! outside.williamstein92) outside.williamstein92 = {};

  if ( ! outside.williamstein92.Application
      || (outside.williamstein92.Application instanceof Application
          && outside.williamstein92.Application.version < app.version)) {
    outside.williamstein92.Application = app;
  }

}(this));
