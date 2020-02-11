const filenameBase = "deno_plugin_example";
let filenameSuffix = ".so";
let filenamePrefix = "lib";

if (Deno.build.os === "win") {
  filenameSuffix = ".dll";
  filenamePrefix = "";
}
if (Deno.build.os === "mac") {
  filenameSuffix = ".dylib";
}
const filename = `./target/debug/${filenamePrefix}${filenameBase}${filenameSuffix}`;

const pluginPath = new URL(filename, import.meta.url).pathname;

const plugin = Deno.openPlugin(pluginPath);
const { testSync, testAsync, testJsonAsync } = plugin.ops;
const decoder = new TextDecoder();
const encoder = new TextEncoder();
function runTestSync(arg: string, zeroCopy?: string): string {
  return decoder.decode(
    testSync.dispatch(
      encoder.encode(arg),
      zeroCopy ? encoder.encode(zeroCopy) : null
    )
  );
}
async function runTestAsync(arg: string, zeroCopy?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    testAsync.setAsyncHandler(resp => {
      resolve(decoder.decode(resp));
    });
    testAsync.dispatch(
      encoder.encode(arg),
      zeroCopy ? encoder.encode(zeroCopy) : null
    );
  });
}

async function runTestJsonAsync(arg: string) {
  return new Promise((resolve) => {
    testJsonAsync.setAsyncHandler(resp => {
      resolve(decoder.decode(resp))
    });
    testJsonAsync.dispatch(encoder.encode(arg), null)
  });
}
// console.log(runTestSync("Deno", "ZeroCopy"));
runTestAsync("Deno1", "ZeroCopy").then(console.log);
runTestAsync("Deno2", "ZeroCopy").then(console.log);
console.log(await runTestJsonAsync("hello deno!"));