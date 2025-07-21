export const mockDAG = {
  nodes: [
    { data: { id: 'A', label: 'Block A' } },
    { data: { id: 'B', label: 'Block B', parent: 'A' } },
    { data: { id: 'C', label: 'Block C', parent: 'A' } },
    { data: { id: 'D', label: 'Block D', parent: 'B' } },
    { data: { id: 'E', label: 'Block E', parent: 'C' } },
  ],
  edges: [
    { data: { source: 'A', target: 'B' } },
    { data: { source: 'A', target: 'C' } },
    { data: { source: 'B', target: 'D' } },
    { data: { source: 'C', target: 'E' } },
  ],
};
