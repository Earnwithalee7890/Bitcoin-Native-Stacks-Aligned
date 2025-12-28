# Bitcoin-Native & Stacks-Aligned 🚀

Built for the **Stacks Builder Challenge #3**, this project is a premium dashboard designed to showcase the power of Bitcoin L2 (Stacks) and global builder tracking.

## 🌟 Overview

**Bitcoin-Native & Stacks-Aligned** is a modern Web3 application that integrates the latest Stacks ecosystem standards. It allows users to perform daily "Check-Ins" on the Stacks mainnet, contributing to their global reputation while interacting with custom Clarity smart contracts.

### Key Features
- **Reown AppKit Integration**: Uses Reown AppKit for modern wallet discovery and WalletConnect-compatible connection flows.
- **Clarity 4 Contract**: Interaction with a custom deployed Clarity 4 contract (`check-in`) utilizing `stacks-block-height`.
- **Economical Check-Ins**:
    - **Fee**: 0.01 STX per check-in (transferred to the project treasury).
    - **Reward**: 0.001 STX rebate paid directly from the contract to the user.
- **GitHub Synergy**: Integrated (mocked) GitHub contribution tracking to align Bitcoin L2 activity with developer output.
- **Premium UI**: Dark-mode glassmorphism design built with Next.js, Tailwind CSS, and Framer Motion.

## 🛠️ Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (Glassmorphism + Stacks Purple Theme)
- **Blockchain SDK**:
    - `@reown/appkit`: For wallet discovery and challenge compliance.
    - `@stacks/connect` & `@stacks/transactions`: For secure transaction signing.
    - `@stacks/network`: Stacks Mainnet integration.
- **Smart Contract**: Clarity 4 (Deployed on Stacks Mainnet)
- **Icons & Animations**: Lucide-React + Framer Motion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- [Leather Wallet](https://leather.io/) or [Xverse Wallet](https://www.xverse.app/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Earnwithalee7890/Bitcoin-Native-Stacks-Aligned.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Challenge Compliance

This project specifically addresses the **Stacks Builder Challenge #3** requirements:
- **Use of WalletKit SDK / Reown AppKit**: Integrated through the `@reown/appkit` discovery layer.
- **On-chain Transactions**: Daily check-ins generate real Stacks mainnet transactions and fees.
- **Clarity 4 Adoption**: The underlying contract is written in Clarity 4 for maximum efficiency and security.
- **Project Branding**: Fully rebranded to align with the "Bitcoin-Native & Stacks-Aligned" vision.

## 🔗 Contract Details

- **Contract Address**: `SP2F500B8DTRK1EANJQ054BRAB8DDKN6QCMXGNFBT`
- **Contract Name**: `check-in`
- **Network**: Stacks Mainnet

---
*Built with ❤️ for the Stacks Community.*
