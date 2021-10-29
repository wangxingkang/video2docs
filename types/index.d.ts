/// <reference path="./importMeta.d.ts" />
/// <reference path="./env.d.ts" />
/// <reference path="./custom-typings.d.ts" />

declare interface Window {
  electron: Readonly<ElectronApi>;
}
