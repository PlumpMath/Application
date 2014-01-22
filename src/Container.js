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
   * @param   argv          arguments for constructor
   * @return                built instance
   */
  container.buildWithArguments = function (constructor, argv) {
    if (argv) argv.unshift(null);
    return new (Function.prototype.bind.apply(constructor, argv));
  }

  // }}}
};

// }}}
