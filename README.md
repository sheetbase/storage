<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @sheetbase/storage

**Sheetbase file management with Drive.**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Installation](#installation)
- [Options](#options)
- [Lib](#lib)
  - [Lib properties](#lib-properties)
  - [Lib methods](#lib-methods)
    - [`registerRoutes(routeEnabling?, middlewares?)`](#lib-registerroutes-0)
- [Routing](#routing)
  - [Errors](#routing-errors)
  - [Routes](#routing-routes)
    - [Routes overview](#routing-routes-overview)
    - [Routes detail](#routing-routes-detail)
      - [`DELETE` /storage](#DELETE__storage)
      - [`GET` /storage](#GET__storage)
      - [`POST` /storage](#POST__storage)
      - [`PUT` /storage](#PUT__storage)
- [Detail API reference](https://sheetbase.github.io/storage)


</section>

<section id="installation" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="installation"><p>Installation</p>
</a></h2>

- Install: `npm install --save @sheetbase/storage`

- Usage:

```ts
// 1. import module
import { StorageModule } from "@sheetbase/storage";

// 2. create an instance
export class App {
  // the object
  storageModule: StorageModule;

  // initiate the instance
  constructor() {
    this.storageModule = new StorageModule(/* options */);
  }
}
```

</section>

<section id="options" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="options"><p>Options</p>
</a></h2>

| Name                                                                                         | Type                                    | Description |
| -------------------------------------------------------------------------------------------- | --------------------------------------- | ----------- |
| [allowTypes?](https://sheetbase.github.io/storage/interfaces/options.html#allowtypes)        | <code>string[]</code>                   |             |
| [maxSize?](https://sheetbase.github.io/storage/interfaces/options.html#maxsize)              | <code>undefined \| number</code>        |             |
| [nested?](https://sheetbase.github.io/storage/interfaces/options.html#nested)                | <code>undefined \| false \| true</code> |             |
| [**uploadFolder**](https://sheetbase.github.io/storage/interfaces/options.html#uploadfolder) | <code>string</code>                     |             |
| [urlBuilder?](https://sheetbase.github.io/storage/interfaces/options.html#urlbuilder)        | <code>string[] \| function</code>       |             |

</section>

<section id="lib" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="lib" href="https://sheetbase.github.io/storage/classes/lib.html"><p>Lib</p>
</a></h2>

**The `Lib` class.**

<h3><a name="lib-properties"><p>Lib properties</p>
</a></h3>

| Name                                                                                  | Type                                                                                                                      | Description |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [helperService](https://sheetbase.github.io/storage/classes/lib.html#helperservice)   | <code><a href="https://sheetbase.github.io/storage/classes/helperservice.html" target="_blank">HelperService</a></code>   |             |
| [optionService](https://sheetbase.github.io/storage/classes/lib.html#optionservice)   | <code><a href="https://sheetbase.github.io/storage/classes/optionservice.html" target="_blank">OptionService</a></code>   |             |
| [storageRoute](https://sheetbase.github.io/storage/classes/lib.html#storageroute)     | <code><a href="https://sheetbase.github.io/storage/classes/storageroute.html" target="_blank">StorageRoute</a></code>     |             |
| [storageService](https://sheetbase.github.io/storage/classes/lib.html#storageservice) | <code><a href="https://sheetbase.github.io/storage/classes/storageservice.html" target="_blank">StorageService</a></code> |             |

<h3><a name="lib-methods"><p>Lib methods</p>
</a></h3>

| Function                                                              | Returns type                 | Description              |
| --------------------------------------------------------------------- | ---------------------------- | ------------------------ |
| [registerRoutes(routeEnabling?, middlewares?)](#lib-registerroutes-0) | <code>RouterService<></code> | Expose the module routes |

<h4><a name="lib-registerroutes-0" href="https://sheetbase.github.io/storage/classes/lib.html#registerroutes"><p><code>registerRoutes(routeEnabling?, middlewares?)</code></p>
</a></h4>

**Expose the module routes**

**Parameters**

| Param         | Type                                         | Description |
| ------------- | -------------------------------------------- | ----------- |
| routeEnabling | <code>true \| DisabledRoutes</code>          |             |
| middlewares   | <code>Middlewares \| RouteMiddlewares</code> |             |

**Returns**

<code>RouterService<></code>

---

</section>

<section id="routing" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="routing"><p>Routing</p>
</a></h2>

**StorageModule** provides REST API endpoints allowing clients to access server resources. Theses enpoints are not exposed by default, to expose the endpoints:

```ts
StorageModule.registerRoutes(routeEnabling?);
```

<h3><a name="routing-errors"><p>Errors</p>
</a></h3>

**StorageModule** returns these routing errors, you may use the error code to customize the message:

- `storage/invalid-size`: The file is too big.
- `storage/invalid-type`: The file format is not supported.
- `storage/invalid-upload`: Invalid upload resource.
- `storage/no-edit`: No EDIT permission.
- `storage/no-file`: File not found (no VIEW permission or trashed).

<h3><a name="routing-routes"><p>Routes</p>
</a></h3>

<h4><a name="routing-routes-overview"><p>Routes overview</p>
</a></h4>

| Route                        | Method   | Disabled | Description                    |
| ---------------------------- | -------- | -------- | ------------------------------ |
| [/storage](#DELETE__storage) | `DELETE` | `true`   | delete a file                  |
| [/storage](#GET__storage)    | `GET`    |          | Get file information           |
| [/storage](#POST__storage)   | `POST`   | `true`   | update a file                  |
| [/storage](#PUT__storage)    | `PUT`    | `true`   | upload a file / multiple files |

<h4><a name="routing-routes-detail"><p>Routes detail</p>
</a></h4>

<h5><a name="DELETE__storage"><p><code>DELETE</code> /storage</p>
</a></h5>

`DISABLED` delete a file

**Request body**

| Name   | Type       | Description |
| ------ | ---------- | ----------- |
| **id** | <a data-sref="string"><code>string</code></a> |             |

**Middleware data**

| Name     | Type         | Description |
| -------- | ------------ | ----------- |
| **auth** | <a data-sref="AuthData" href="https://sheetbase.github.io/storage/interfaces/authdata.html"><code>AuthData</code></a> |             |

**Response**

`void`

---

<h5><a name="GET__storage"><p><code>GET</code> /storage</p>
</a></h5>

Get file information

**Request query**

| Name   | Type       | Description |
| ------ | ---------- | ----------- |
| **id** | <a data-sref="string"><code>string</code></a> |             |

**Middleware data**

| Name  | Type         | Description |
| ----- | ------------ | ----------- |
| auth? | <a data-sref="AuthData" href="https://sheetbase.github.io/storage/interfaces/authdata.html"><code>AuthData</code></a> |             |

**Response**

`FileInfo`

---

<h5><a name="POST__storage"><p><code>POST</code> /storage</p>
</a></h5>

`DISABLED` update a file

**Request body**

| Name       | Type               | Description |
| ---------- | ------------------ | ----------- |
| **id**     | <a data-sref="string"><code>string</code></a>         |             |
| **update** | <a data-sref="FileUpdateData" href="https://sheetbase.github.io/storage/interfaces/fileupdatedata.html"><code>FileUpdateData</code></a> |             |

**Middleware data**

| Name     | Type         | Description |
| -------- | ------------ | ----------- |
| **auth** | <a data-sref="AuthData" href="https://sheetbase.github.io/storage/interfaces/authdata.html"><code>AuthData</code></a> |             |

**Response**

`void`

---

<h5><a name="PUT__storage"><p><code>PUT</code> /storage</p>
</a></h5>

`DISABLED` upload a file / multiple files

**Request body**

| Name    | Type                 | Description |
| ------- | -------------------- | ----------- |
| file?   | <a data-sref="UploadFile" href="https://sheetbase.github.io/storage/interfaces/uploadfile.html"><code>UploadFile</code></a>       |             |
| folder? | <a data-sref="string"><code>string</code></a>           |             |
| rename? | <a data-sref="RenamePolicy" href="https://sheetbase.github.io/storage/globals.html#renamepolicy"><code>RenamePolicy</code></a>     |             |
| share?  | <a data-sref="FileSharing" href="https://sheetbase.github.io/storage/globals.html#filesharing"><code>FileSharing</code></a>      |             |
| files?  | <a data-sref="UploadResource["><code>UploadResource[</code></a>] |             |

**Middleware data**

| Name  | Type         | Description |
| ----- | ------------ | ----------- |
| auth? | <a data-sref="AuthData" href="https://sheetbase.github.io/storage/interfaces/authdata.html"><code>AuthData</code></a> |             |

**Response**

`FileInfo | FileInfo[]`

---

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@sheetbase/storage** is released under the [MIT](https://github.com/sheetbase/storage/blob/master/LICENSE) license.

</section>
