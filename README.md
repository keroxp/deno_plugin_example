# deno_plugin_test


This is an example repository of basic rust plugin for [Deno](https://deno.land)

## Build

Use latest `rustc` and `deno`. 

`cargo build` will make files below:

- `target/debug/libdeno_plugin_example.dylyb` (mac)
- `target/debug/libdeno_plugin_example.so` (linux)
- `target/debug/deno_plugin_example.dll` (win)

Those dynamic linc libraries are the artifact of plugin. 

## Use plugin

To use built plugin on deno, you need to load plugin dynamically on runtime. See `main.ts` for detail.

```ts
// The path for built plugin
const pluginPath = "./target/debug/...."
// Load plugin dynamically
const plugin = Deno.openPlugin(pluginPath);
// Get ts-side operation functions from plugin
const { testSync, testAsync } = plugin.ops;

// Dispatch synchronous operation. Arguments and response are `Uint8Array`
const syncResp: Uint8Array = testSync.dispatch(new Uint8Array([0,1,2,3]));
const asyncResp = await new Promise<Uint8Array>(resolve => {
  // Register handler for async oeration
  testAsync.setAsyncHandler((resp: Uint8Array) => {
    // do stuff
    resolve(resp);
  })
  // Dispatch async operation with argument
  testAsync.dispatch(new Uint8Array([0,1,2,3]))
});
```


