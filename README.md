# sequelize-block-records

A very simple [Sequelize](https://github.com/sequelize/sequelize) plugin which adds capacity for block records with only set a flag attribute.

# Warning

The project is based on the repository [node-sequelize-noupdate-attributes](https://github.com/dededavida/sequelize-notupdate-attributes).

## Prerequisites

Have previously installed the `sequelize` package in the project.

## Install

```sh
yarn add -D sequelize-block-records
```

## Usage

Add the plugin to the sequelize instance, add a boolean field to models used like flag 
to block records, set the blockRecords option and optionally you can specify the blockField
option with the field name for use as flag, as shown in the basic example below:

```js
var sequelizeBlockRecords = require('@itarna/sequelize-block-records');

var sequelize = new Sequelize('database', 'user', 'password');
sequelizeBlockRecords(sequelize); // Note that is the `sequelize` instance the passed reference.

var Post = sequelize.define('Post', {
  content: Sequelize.STRING,
  isClosed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
}, {
  blockRecords: true,
  blockField: 'isClosed',
});
```

What this do is to mark the `isClosed` attribute as **blockField**, then:

- if the record is new, the `isClosed` field will be set to `false` by default and it can be updated.
- when the record is saved, if the `isClosed` previous value is `true`, then the record is blocked and no update will be allowed.
- 
## Issues

The source is available for download from [GitHub](https://github.com/Itarna/sequelize-block-records)
and there is a [issue tracker](https://github.com/Itarna/sequelize-block-records/issues) so you can report bugs there.

## Tests

To run the tests just execute `yarn test`.

## License

The MIT License (MIT)

Copyright (c) Ing. Ariel Alberto Grassano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
