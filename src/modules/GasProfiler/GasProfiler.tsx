/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Interface } from 'ethers';
import { createClient } from '@remixproject/plugin-iframe';

const client = createClient();

interface Branch {
  name: string;
  rpc: string;
  status: 'live' | 'coming';
}

const allBranches: Branch[] = [
  { name: 'Primordial', rpc: 'https://rpc.primordial.bdagscan.com', status: 'live' },
  { name: 'Alpha', rpc: 'https://rpc.nebula.bdagscan.com', status: 'coming' },
  { name: 'Celestial', rpc: 'https://rpc.celestial.bdagscan.com', status: 'coming' },
  { name: 'Quantum', rpc: 'https://rpc.quantum.bdagscan.com', status: 'coming' },
];

const GasProfiler: React.FC = () => {
  const [, setAbi] = useState<any[] | null>(null);
  const [bytecode, setBytecode] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [functionInputs, setFunctionInputs] = useState<any[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [results, setResults] = useState<{ [key: string]: string }>({});
  const [functions, setFunctions] = useState<any[]>([]);
  const [iface, setIface] = useState<Interface | null>(null);
  const [isDeployment, setIsDeployment] = useState(false);
  const [branchWarning, setBranchWarning] = useState(false);
  const [showAllBranches, setShowAllBranches] = useState(false);

  useEffect(() => {
    const fetchRemixData = async () => {
      try {
        await client.onload();
        const result = await client.call('solidity', 'getCompilationResult');
        const compilation = result?.data;
        if (!compilation?.contracts) return;

        const fileName = Object.keys(compilation.contracts)[0];
        const contractName = Object.keys(compilation.contracts[fileName])[0];
        const contract = compilation.contracts[fileName][contractName];

        const abiData = contract.abi;
        const ifaceInstance = new Interface(abiData);

        setAbi(abiData);
        setBytecode(contract.evm.bytecode.object || '');
        setIface(ifaceInstance);
        setFunctions(abiData.filter((item: any) => item.type === 'function'));

        const accounts = await client.call('udapp', 'getAccounts');
        setFromAddress(accounts[0]);
      } catch (err) {
        console.error('Failed to load Remix data:', err);
      }
    };

    fetchRemixData();
  }, []);

  const handleFunctionChange = (fnName: string) => {
    setSelectedFunction(fnName);
    const fn = functions.find((f) => f.name === fnName);
    setFunctionInputs(fn?.inputs || []);
    setInputValues(new Array(fn?.inputs?.length || 0).fill(''));
  };

  const handleBranchToggle = (rpc: string) => {
    setSelectedBranches((prev) => {
      const updated = prev.includes(rpc)
        ? prev.filter((b) => b !== rpc)
        : [...prev, rpc];
      if (updated.length > 0) setBranchWarning(false);
      return updated;
    });
  };

  const encodeFunctionInputs = (): string => {
    if (!iface || !selectedFunction) return '';
    try {
      const fn = functions.find((f) => f.name === selectedFunction);
      const types = fn?.inputs?.map((input: any) => input.type) || [];
      const parsedValues = inputValues.map((val, i) => {
        const type = types[i];
        if (type.startsWith('uint') || type.startsWith('int')) {
          return BigInt(val);
        } else if (type === 'bool') {
          return val === 'true' || val === '1';
        }
        return val;
      });
      return iface.encodeFunctionData(selectedFunction, parsedValues);
    } catch (err) {
      console.error('Encoding error:', err);
      return '';
    }
  };

  const estimateGas = async () => {
    if (selectedBranches.length === 0) {
      setBranchWarning(true);
      return;
    }

    if (!fromAddress || (isDeployment && !bytecode) || (!isDeployment && !contractAddress)) {
      alert('Missing required fields');
      return;
    }

    setBranchWarning(false);
    const output: { [key: string]: string } = {};
    const data = isDeployment ? '0x' + bytecode : encodeFunctionInputs();

    for (const branch of selectedBranches) {
      try {
        const res = await fetch(branch, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [
              {
                from: fromAddress,
                ...(isDeployment ? {} : { to: contractAddress }),
                data,
              },
            ],
            id: 1,
          }),
        });

        const json = await res.json();
        const gas = json?.result ? parseInt(json.result, 16) : 0;

        const gasPriceRes = await fetch(branch, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: 2,
          }),
        });

        const gasPriceJson = await gasPriceRes.json();
        const gasPrice = gasPriceJson?.result ? parseInt(gasPriceJson.result, 16) : 0;

        if (gas && gasPrice) {
          const costInETH = (gas * gasPrice) / 1e18;
          output[branch] = `${gas} gas × ${gasPrice} wei = ${costInETH.toFixed(6)} ETH`;
        } else {
          output[branch] = `Error: Unable to fetch gas or price`;
        }
      } catch (err: any) {
        output[branch] = `Error: ${err.message}`;
      }
    }

    setResults(output);
  };

  const visibleBranches = showAllBranches
    ? allBranches
    : allBranches.filter((b) => b.status === 'live');

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-[#0f172a] text-white rounded-lg shadow-lg space-y-6 font-sans">
      <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 text-center">
        Multi-Branch Gas Profiler
      </h2>

      <div className="text-sm text-slate-400 bg-slate-800 p-3 rounded-md border border-slate-700">
        🧬 <strong>Primordial</strong> is the only live branch. Others are part of the upcoming multi-chain DAG rollout.
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          placeholder="Contract Address (optional)"
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          disabled={isDeployment}
        />
        <input
          placeholder="From Address"
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={isDeployment}
          onChange={() => setIsDeployment(!isDeployment)}
          className="accent-cyan-500"
        />
        Estimate contract deployment
      </label>

      {!isDeployment && (
        <>
          <div>
            <label className="block text-slate-300 mb-2 font-semibold">Select Function</label>
            <select
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={selectedFunction}
              onChange={(e) => handleFunctionChange(e.target.value)}
            >
              <option value="">-- Select --</option>
              {functions.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {functionInputs.length > 0 && (
            <div className="space-y-2">
              <label className="font-semibold block text-slate-300">Function Inputs</label>
              {functionInputs.map((input, idx) => (
                <input
                  key={idx}
                  placeholder={`${input.name || 'arg'} (${input.type})`}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white placeholder-slate-400"
                  value={inputValues[idx] || ''}
                  onChange={(e) => {
                    const newValues = [...inputValues];
                    newValues[idx] = e.target.value;
                    setInputValues(newValues);
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block font-semibold text-slate-300">
            Select Branches{' '}
            {branchWarning && (
              <span className="ml-2 text-red-400 text-sm font-normal">⚠️ Required</span>
            )}
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={showAllBranches}
              onChange={() => setShowAllBranches(!showAllBranches)}
              className="accent-cyan-500"
            />
            Show test branches
          </label>
        </div>

        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 rounded ${branchWarning ? 'border border-red-500 bg-red-900/10' : ''}`}>
          {visibleBranches.map((branch) => (
            <label key={branch.rpc} className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={selectedBranches.includes(branch.rpc)}
                onChange={() => handleBranchToggle(branch.rpc)}
                className="accent-cyan-500"
                disabled={branch.status !== 'live'}
              />
              <span>
                {branch.name}{' '}
                {branch.status === 'live' ? (
                  <span className="text-green-400 text-xs font-bold ml-1">✅ Live</span>
                ) : (
                  <span className="text-yellow-300 text-xs ml-1">🛠️ Coming Soon</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={estimateGas}
        className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded text-white font-semibold transition hover:scale-[1.02]"
      >
        Estimate Gas Usage
      </button>

      {Object.keys(results).length > 0 && (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 shadow-inner">
          <h3 className="text-lg font-bold text-cyan-300 mb-3">⛽ Estimated Gas & Cost</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(results).map(([branch, result]) => (
              <li key={branch}>
                <strong className="text-yellow-400">
                  {allBranches.find((b) => b.rpc === branch)?.name || branch}:
                </strong>{' '}
                <span className="text-slate-300">{result}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GasProfiler;
