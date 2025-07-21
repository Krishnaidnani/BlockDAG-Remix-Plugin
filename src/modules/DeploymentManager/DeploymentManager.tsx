/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { ethers, ContractFactory } from 'ethers';
import { client } from '../../remixPlugin';
import { fetchLatestBlockHeads, type Branch } from '../../hooks/useBranches';
import CopyField from '../../components/CopyField';

//const PRIMORDIAL_RPC = 'https://test-rpc.primordial.bdagscan.com';
//const CHAIN_ID = 1043;

type CompilationResult = {
  data: {
    contracts: {
      [file: string]: {
        [name: string]: {
          abi: any[];
          evm: { bytecode: { object: string } };
        };
      };
    };
  };
};

export default function DeploymentManager() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [compiledContracts, setCompiledContracts] = useState<string[]>([]);
  const [contractName, setContractName] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [txInfo, setTxInfo] = useState<{ address: string; txHash: string } | null>(null);

  useEffect(() => {
    client.call('solidity', 'getCompilationResult')
    .then((result ) => {
        const ct = result?.data?.contracts;
        if (ct) {
          const names = Object.values(ct).flatMap(Object.keys);
          setCompiledContracts(names);
        }
      })
      .catch(console.error);
  }, []);

  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    fetchLatestBlockHeads()
      .then((heads) => {
        setBranches(heads);
        if (heads.length) setSelectedBranch(heads[0].id);
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  const deploy = async () => {
    if (!contractName || !selectedBranch) {
      alert('Select both contract and branch');
      return;
    }
    setStatus('deploying');

    try {
      const result = await client.call('solidity', 'getCompilationResult') as CompilationResult;
      let target: any;
      for (const file of Object.values(result.data.contracts)) {
        if (file[contractName]) { target = file[contractName]; break; }
      }
      if (!target) throw new Error('Contract not found');

      //const provider = new ethers.JsonRpcProvider(PRIMORDIAL_RPC, { name: 'primordial', chainId: CHAIN_ID });
      const abi = target.abi;
      const bytecode = target.evm.bytecode.object;

      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await new ethers.BrowserProvider((window as any).ethereum).getSigner();

      const factory = new ContractFactory(abi, bytecode, signer);
      const contract = await factory.deploy();
      const tx = contract.deploymentTransaction();
      console.log(tx?.hash);
      await sleep(4000); 

      setTxInfo({ address: await contract.getAddress(), txHash: tx?.hash ?? '' });
      setStatus('success');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  return (
    <div className="px-4 py-8 sm:p-8 bg-slate-900 rounded-2xl shadow-2xl max-w-2xl mx-auto space-y-6 border border-slate-700">
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
         Deploy Contract to BlockDAG
      </h2>

      <div className="space-y-2">
        <label className="text-gray-300 text-sm font-medium">Select Contract</label>
        <select
          className="w-full p-2 bg-slate-800 text-white rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={contractName}
          onChange={(e) => setContractName(e.target.value)}
        >
          <option value="">-- Choose Contract --</option>
          {compiledContracts.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-gray-300 text-sm font-medium">
          Select Branch (Block Head)
          <span className="text-xs text-yellow-400 ml-1">(Coming Soon)</span>
        </label>
        <select
          className="w-full p-2 bg-slate-800 text-white rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="">-- Choose Branch --</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={deploy}
          disabled={status === 'deploying'}
          className="w-full sm:w-auto bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {status === 'deploying' ? 'Deploying...' : 'Deploy Contract'}
        </button>
      </div>

      {status === 'success' && txInfo && (
  <div className="bg-green-100 border border-green-400 text-green-800 rounded-lg px-4 py-3 text-sm break-words space-y-2">
    ✅ <strong>Deployment successful!</strong>
    <CopyField label="Address" value={txInfo.address} />
    <CopyField label="Tx Hash" value={txInfo.txHash} />
  </div>
)}


      {status === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-800 rounded-lg px-4 py-3 text-sm">
          ❌ Deployment failed. Please try again.
        </div>
      )}
    </div>
  );
}
