Application IoC Container
=========================

Application is an IoC Container, meant to wrap your javascript application.
Here are some examples.

### Application can bind classes and later resolve them.

Say we have a class, Version.
```
// bind Version to name "Version"
app.bind("Version", Version);

// get new instance of Version
var version = app.resolve("Version");

// 1.
console.log(version);
// 2.
console.log(version.toString());

//output
// 1.
Version {major: Number, minor: Number, compare: function…}
// 2.
0.0.0
```

### Application handles a classes' dependencies.

Application determines the dependencies of managed classes on the fly,
and injects those dependencies into the newly constructed instance.
These dependencies don't have to be custom classes,
Application can resolve primitives, too.

Version, has three dependencies, all of which are Number.
```
// change what "Number" points to
app.bind(\"Number\", function () { return new Number(10); })
var version = app.resolve("Version");

console.log(version.toString());

//output
10.10.10
```

### Thank you, and happy coding!

Email questions or comments to: [williamstein92@gmail.com](mailto:williamstein92@gmail.com)
