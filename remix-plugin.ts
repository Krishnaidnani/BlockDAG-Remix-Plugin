// remix-plugin.ts
import { createClient } from '@remixproject/plugin-webview';
import { PluginClient } from '@remixproject/plugin';

// 1. Create the client
const baseClient = new PluginClient();

// 2. Connect it using createClient
createClient(baseClient); // This wires up the webview connection

// 3. Export the connected client
export const remixClient = baseClient;
export type RemixClient = typeof remixClient;
