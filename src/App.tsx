import { useState } from 'react';
import DAGVisualizer from '../src/modules/DAGVisualizer/DAGVisualizer';
import DeploymentManager from '../src/modules/DeploymentManager/DeploymentManager';
import GasProfiler from '../src/modules/GasProfiler/GasProfiler';

const App = () => {
  const [activeTab, setActiveTab] = useState<'dag' | 'deploy' | 'gas'>('dag');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            className={`px-5 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-200 shadow-md ${
              activeTab === 'dag'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('dag')}
          >
            DAG Explorer
          </button>
          <button
            className={`px-5 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-200 shadow-md ${
              activeTab === 'deploy'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('deploy')}
          >
            Contract Deployment
          </button>
          <button
            className={`px-5 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-200 shadow-md ${
              activeTab === 'gas'
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('gas')}
          >
            Gas Profiler
          </button>
        </div>

        {/* Active Module */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          {activeTab === 'dag' && <DAGVisualizer />}
          {activeTab === 'deploy' && <DeploymentManager />}
          {activeTab === 'gas' && <GasProfiler />}
        </div>
      </div>
    </div>
  );
};

export default App;
