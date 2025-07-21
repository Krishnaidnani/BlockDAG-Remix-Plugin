/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import type { DagreLayoutOptions } from 'cytoscape-dagre';
import './style.css';

cytoscape.use(dagre);

const DAGVisualizer = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<cytoscape.Core | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(renderGraph, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchBlocks = async () => {
    const response = await fetch(
      'https://api.primordial.bdagscan.com/v1/api/block/getAllBlocks?limit=50&page=1&chain=EVM'
    );
    const json = await response.json();
    return json.data || [];
  };

  const renderGraph = async () => {
    setLoading(true);
    const blocks = await fetchBlocks();

    const screenWidth = window.innerWidth;
    const nodeSize = screenWidth < 640 ? 50 : screenWidth < 1024 ? 70 : 90;
    const nodeFontSize = screenWidth < 640 ? 8 : 10;

    const nodes = blocks.map((block: any) => ({
      data: {
        id: block.blockHash,
        label: `#${block.blockNumber}`,
        block,
      },
    }));

    const nodeIds = new Set(nodes.map((n: { data: { id: any; }; }) => n.data.id));

    const edges = blocks.flatMap((block: any) => {
      const edgeList: any[] = [];
      if (block.parentHash && nodeIds.has(block.parentHash)) {
        edgeList.push({
          data: {
            id: `edge-${block.blockHash}-main`,
            source: block.parentHash,
            target: block.blockHash,
          },
        });
      }
      return edgeList;
    });

    if (cyInstance.current) {
      cyInstance.current.destroy();
    }

    const cy = cytoscape({
      container: cyRef.current!,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#0ea5e9',
            'text-valign': 'center',
            'text-halign': 'center',
            label: 'data(label)',
            color: '#ffffff',
            'font-size': nodeFontSize,
            'font-weight': 'bold',
            width: nodeSize,
            height: nodeSize,
            shape: 'ellipse',
            'text-outline-color': '#0ea5e9',
            'text-outline-width': 1,
          },
        },
        {
          selector: 'node:hover',
          style: {
            width: nodeSize + 10,
            height: nodeSize + 10,
            'background-color': '#38bdf8',
           
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#e0f2fe',
            'target-arrow-color': '#e0f2fe',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            opacity: 0.8,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#facc15',
            'text-outline-color': '#facc15',
            width: nodeSize + 20,
            height: nodeSize + 20,
          },
        },
      ],
      layout: {
        name: 'dagre',
        rankDir: 'LR',
        nodeSep: 60,
        rankSep: 80,
      }as DagreLayoutOptions,
      zoom: 1,
    });

    cy.ready(() => {
      cy.fit(undefined, 50);
    });

    cy.on('tap', 'node', (event) => {
      const data = event.target.data();
      setSelectedBlock(data.block);
    });

    cyInstance.current = cy;
    setLoading(false);
  };

  useEffect(() => {
    renderGraph();
    return () => {
      cyInstance.current?.destroy();
    };
  }, []);

  const searchBlock = () => {
    const cy = cyInstance.current;
    if (!cy) return;

    const match = cy.nodes().filter((node) =>
      node.id().toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (match.length > 0) {
      cy.animate({ fit: { eles: match, padding: 100 }, duration: 600 });
      match.select();
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white font-sans transition-all duration-300">
      {/* Top Bar */}
      <div className="backdrop-blur bg-white/10 border-b border-white/20 sticky top-0 z-50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <h2 className="text-lg sm:text-2xl font-extrabold text-cyan-300">
          DAG Explorer
        </h2>
        <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search block hash..."
            className="flex-1 min-w-0 sm:w-auto px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:ring focus:ring-cyan-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={searchBlock}
            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition hover:scale-105"
          >
            🔍
          </button>
          <button
            onClick={renderGraph}
            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition hover:scale-105"
          >
            🔄
          </button>
          <label className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
              className="accent-cyan-500"
            />
            Auto-refresh
          </label>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-6 text-cyan-300 animate-pulse">
          <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></span>
          Loading latest DAG blocks...
        </div>
      )}

      {/* Graph Container */}
      <div
        ref={cyRef}
        className="w-full h-[70vh] sm:h-[750px] border-t border-white/10"
      />

      {/* Block Info Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-l border-white/20 shadow-xl text-white z-50 transform transition-transform duration-500 ${
          selectedBlock ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 sm:p-6 overflow-y-auto h-full">
          {selectedBlock && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400">
                  ⛓ Block #{selectedBlock.blockNumber}
                </h3>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="text-red-400 hover:text-red-500 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="grid gap-2 sm:gap-3 text-sm text-slate-300 break-words">
                <p><b>Status:</b> {selectedBlock.status}</p>
                <p><b>Hash:</b> {selectedBlock.blockHash}</p>
                <p><b>Parent:</b> {selectedBlock.parentHash}</p>
                <p><b>Tx Count:</b> {selectedBlock.transactionCount}</p>
                <p><b>Size:</b> {selectedBlock.blockSize}</p>
                <p><b>Gas:</b> {selectedBlock.gasUsed} / {selectedBlock.gasLimit}</p>
                <p><b>Base Fee:</b> {selectedBlock.baseFee}</p>
                <p><b>Burnt Fee:</b> {selectedBlock.burntFee}</p>
                <p><b>Difficulty:</b> {selectedBlock.totalDifficulty}</p>
                <p><b>Receipts Root:</b> {selectedBlock.receiptsRoot}</p>
                <p><b>Timestamp:</b> {new Date(parseInt(selectedBlock.timestamp) * 1000).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DAGVisualizer;
