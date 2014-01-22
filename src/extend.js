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
