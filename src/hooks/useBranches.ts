export type Branch = { id: string; name: string };

export const fetchLatestBlockHeads = async (count = 5): Promise<Branch[]> => {
  const res = await fetch('https://rpc.primordial.bdagscan.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
    }),
  });

  const data = await res.json();
  const latestBlock = data.result;

  if (!latestBlock?.hash) throw new Error('No block hash found');


  return Array.from({ length: count }).map((_, i) => ({
    id: `${latestBlock.hash}-${i}`, 
    name: `Branch ${i + 1} – ${latestBlock.hash.slice(0, 12)}...`,
  }));
};
