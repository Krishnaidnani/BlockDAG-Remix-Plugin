/* eslint-disable @typescript-eslint/no-explicit-any */
import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';

// Create and connect the plugin client
const plugin = new PluginClient();
export const client = createClient(plugin);

// When the plugin is loaded
client.onload().then(() => {
  client.call('terminal', 'log', {
    type: 'info',
    value: ['🎯 Remix Plugin loaded successfully!']
  });

  // ✅ Listen to contract deployments
  (client as any).on('udapp', 'addInstance', (instance: { name: any; address: any }) => {
    console.log('📦 Contract deployed:', instance);

    // You can use instance.address and instance.name here
    client.call('terminal', 'log', {
      type: 'info',
      value: [`✅ Contract deployed: ${instance.name} @ ${instance.address}`]
    });

    // Optionally auto-fill the address in your React component
    window.postMessage({ type: 'contractDeployed', data: instance }, '*');
  });
});
