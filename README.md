# BlockDAG Explorer Plugin — A Developer Toolkit for the Modular Blockchain Era

---

## Project Overview and Purpose

The BlockDAG Explorer Plugin is a cutting-edge developer toolkit designed for the next evolution of blockchain technology: **Block Directed Acyclic Graphs (BlockDAGs)**. Unlike traditional linear blockchains, BlockDAGs allow multiple branches to exist and process transactions in parallel, significantly enhancing scalability and throughput. However, this powerful architecture introduces new complexities for developers, such as visualizing chain activity, managing contract deployments across different branches, and optimizing smart contract performance.

Our plugin directly addresses these challenges by providing a comprehensive dashboard and toolkit within the Remix IDE (with future plans for VSCode integration). It aims to make developing on modular BlockDAG chains as intuitive as working on traditional blockchains, but with added insights, visual tools, and performance tracking capabilities tailored for the unique nature of DAGs.

### Why BlockDAGs Need This Tool

BlockDAGs fundamentally change how decentralized applications are built and scaled. Without specialized tools, developers face a steep learning curve and lack the necessary visibility to leverage this architecture effectively. Our plugin bridges this gap, giving developers the "map, compass, and control panel" they need to confidently innovate in the modular blockchain era.

---
##  How to Load the Plugin in Remix

You can use the BlockDAG Explorer Plugin directly in the Remix IDE without any installations:

1. Open [Remix IDE](https://remix.ethereum.org/)
2. In the left sidebar, click the **Plugin Manager** (🔌 plug icon)
3. Scroll to the bottom and click **“Connect to a Local Plugin”**
4. Paste the following URL into the input box:

   ```bash
   https://block-dag-remix-plugin.vercel.app/
5. Click **Connect**

Once connected, you'll see the **BlockDAG Explorer Plugin** appear in the Remix sidebar.
This plugin is fully client-side and secure — no data is stored or shared.

🎥 **Demo Video:** [Watch the plugin in action](https://vimeo.com/1103213879?share=copy)


## What We've Built

The BlockDAG Explorer Plugin features three core functionalities, all engineered to maximize developer productivity and insight on BlockDAG-based chains:

### 1. A Visual DAG Explorer

Understanding the intricate web of blocks and branches in a DAG is crucial. Our live graph visually maps the chain's structure, illustrating how blocks reference each other and how different branches evolve over time.

**Key Features:**

* **Zoomable Interface:** Seamlessly zoom into any part of the DAG to explore its granular structure.
* **Detailed Block Information:** Hover over blocks to instantly view details like block hash, parent hashes, branch ID, transaction count, and more.
* **Multiple Layouts:** Switch between various visualization layouts (e.g., tree view, force-directed view) for optimal analysis.
* **Real-time Updates:** The graph refreshes in real-time as the network processes new blocks, providing an up-to-the-minute view of the chain.

### 2. Multi-Chain Contract Deployment Manager

BlockDAGs enable smart contracts to reside on different branches, offering unprecedented flexibility. Our plugin simplifies this by allowing developers to choose their deployment target directly from the Remix IDE.

**How it Works:**

* **Branch Listing:** The plugin automatically pulls and displays a list of available BlockDAG branches (e.g., Primordial, Alpha, Celestial).
* **Compiled Contract Selection:** Select your compiled Solidity contract (e.g., `MyToken.sol`) directly from Remix's compilation results.
* **One-Click Deployment:** Choose your desired branch, and deploy the contract with a single click.
* **Instant Feedback:** Receive the deployed contract address, transaction hash, and real-time deployment status within the plugin interface.

### 3. Gas Profiler for Each Branch

Gas costs can vary significantly across different BlockDAG branches due to varying configurations or network congestion. Our integrated gas profiler empowers developers to compare gas usage instantly across multiple branches.

**Functionality:**

* **Contract and Function Selection:** Select a previously deployed contract and the specific function you wish to analyze (e.g., `transfer()`, `vote()`).
* **Input Value Specification:** Provide necessary input values for the chosen function to simulate real-world execution.
* **Multi-Branch Testing:** Select multiple BlockDAG branches to compare gas consumption.
* **Detailed Cost Analysis:** View the estimated gas usage and transaction cost (in ETH) for the selected function on each chosen branch.

---

## Final Deliverable for the Hackathon

By the conclusion of this hackathon, the BlockDAG Explorer Plugin will be:

* **Fully Functional within Remix IDE:** Seamlessly integrated as a Remix plugin.
* **Live DAG Visualizer:** Capable of fetching and rendering real-time chain data.
* **Multi-Branch Contract Deployment:** Supporting deployments to various available branches.
* **Per-Contract, Per-Branch Gas Profiler:** Providing accurate gas estimation and cost comparison.
* **Clean, Intuitive UI:** Designed to feel native and enhance the developer experience within Remix.

---

## Real-World Applications

This developer toolkit offers immediate and tangible utility across a wide range of blockchain use cases:

* **DeFi Teams:** Can deploy and rigorously test financial protocols and strategies on different DAG branches to identify the most performant and cost-effective environments.
* **Game Developers:** Can build and test game logic for various regions or sharded environments within a BlockDAG.
* **Researchers and Protocol Engineers:** Can analyze how different DAG structures impact overall network performance and identify optimal configurations.
* **Educators:** Can leverage the visualizer to demystify BlockDAGs and illustrate their differences from traditional linear chains in an accessible manner.

---

## What Comes After the Hackathon?

We view this hackathon project as the foundational step for a much broader BlockDAG tooling ecosystem. Our future roadmap includes:

* **VSCode Extension:** Porting the plugin to a VSCode extension to allow smart contract developers to write, test, and deploy to BlockDAGs directly within their preferred IDE, complete with features like code completion and inline gas usage hints.
* **Advanced DAG Analytics:** Integrating deeper insights such as chain growth rate, branch utilization over time, and Transactions Per Second (TPS) and block production statistics to empower more informed decisions.
* **Integration with Testing Tools:** Developing support for popular testing frameworks like Hardhat or Foundry, enabling automated multi-branch testing.
* **Open-Source Ecosystem Packaging:** Packaging the tool as a modular, open-source plugin that other BlockDAG-based projects and blockchains can fork, extend, or build on, aiming to establish it as a standard in modular blockchain development.

---

## Why It Matters

BlockDAG technology holds immense promise for the future of decentralized applications, offering unparalleled scalability. However, without the right development tools, its potential remains largely untapped. The BlockDAG Explorer Plugin directly addresses this critical need by closing the gap between BlockDAG's capabilities and developers' ability to harness them. It empowers teams with the visibility, control, and insight necessary to innovate confidently and efficiently in this new, dynamic environment.

---

## Installation Instructions

```bash
# Clone the repository
$ git clone https://github.com/Krishnaidnani/BlockDAG-Remix-Plugin.git
$ cd blockdag-explorer-plugin

# Install dependencies
$ npm install

# Build the plugin
$ npm run build

# Serve the plugin locally
$ npm install -g serve
$ serve -s build -p 8080
```

Open [https://remix.ethereum.org](https://remix.ethereum.org), go to **Plugin Manager** > **Connect to Local Plugin** > enter `http://localhost:8080`, and you're ready to go!

---

## License

MIT License

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
