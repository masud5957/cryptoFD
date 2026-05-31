# "Our Works" Section - Complete Setup Guide

## Overview

The "Our Works" section now displays **real data from the database** controlled entirely through the admin panel. No more generated mock data.

## Components & Data Flow

### 1. **Main Stats** (Top Cards)
- **Total Profit**: Updated via `/admin/trading-control` 
- **Today's Profit**: Updated via `/admin/trading-control`
- **Active Trades**: Updated via `/admin/trading-control`
- **Win Rate**: Updated via `/admin/trading-control`
- **Data Source**: `TradingStats` table
- **API**: `/api/admin/trading-stats` (auto-refreshes every 10 seconds)

### 2. **Monthly Performance** (Table)
- **Shows**: Monthly breakdown with Profit, Trades, Win Rate
- **Calculated From**: `TradingDailyRecord` table (grouped by month)
- **Data Source**: Automatic aggregation from daily records
- **API**: `/api/admin/trading-data/monthly`
- **How to Populate**: Use **"Initialize Sample Data"** button or manually add daily records

### 3. **Portfolio Allocation** (Donut Chart)
- **Shows**: Asset distribution (Bitcoin, Ethereum, etc.)
- **Updated Via**: `/admin/trading-data` → Portfolio Allocation tab
- **Data Source**: `PortfolioAllocation` table
- **API**: `/api/admin/trading-data?type=portfolio`
- **How to Update**: Add/edit assets with percentage and value

### 4. **Live Trading Activity** (Activity List)
- **Shows**: Last 15 trades (BUY/SELL with amounts, profits, time)
- **Updated Via**: `/admin/trading-data` → Live Trading Activity tab
- **Data Source**: `TradingActivity` table
- **API**: `/api/admin/trading-data?type=activity&limit=15`
- **How to Add**: Click "Add New Trade" and enter trade details

## Step-by-Step Setup

### Step 1: Login to Admin Panel
```
URL: http://localhost:3000/admin-login
Email: admin@cryptofd.com
Password: CryptoFD@2024
```

### Step 2: Initialize Historical Data
1. Navigate to **Admin → Trading Data**
2. Click **"Initialize Sample Data"** button
3. Confirm when prompted
4. This populates:
   - 7 months of daily trading records
   - 30 recent trades
   - 4 portfolio allocations
   - Crypto price history

### Step 3: Manage Trading Stats
1. Go to **Admin → Trading Control**
2. Update:
   - Total Profit (use ±100K buttons)
   - Total Trades (use ±100 buttons)
   - Today's Profit (use ±10K buttons)
   - Active Trades (use ±5 buttons)
   - Win Rate (0-100%)
   - Daily Target & Range ($300k-$500k)
3. Click **"Save Changes"** - updates immediately

### Step 4: Add Live Trades
1. Go to **Admin → Trading Data**
2. Click **"Live Trading Activity"** tab
3. Fill in:
   - Crypto (BTC, ETH, BNB, SOL, XRP, ADA)
   - Action (BUY or SELL)
   - Amount (in USDT)
   - Profit (optional, for SELL trades)
4. Click **"Add Trade"**
5. New trade appears immediately on "Our Works" page

### Step 5: Update Portfolio Allocation
1. Go to **Admin → Trading Data**
2. Click **"Portfolio Allocation"** tab
3. Select Asset or enter new one
4. Set Percentage (0-100%)
5. Optional: Set Value in USDT
6. Click **"Update Allocation"**
7. Donut chart updates instantly

## Database Tables Reference

### TradingStats
Stores overall performance metrics:
- `totalProfit` - Cumulative trading profit
- `totalTrades` - Total number of trades
- `todayProfit` - Profit for current day
- `activeTrades` - Number of currently active trades
- `winRate` - Win rate percentage
- `dailyTarget` - Target daily profit
- `dailyTargetMin/Max` - Range for daily target

### TradingDailyRecord
Stores historical daily data (for Monthly Performance):
- `date` - Date of the record
- `profit` - Profit for that day
- `trades` - Number of trades
- `winRate` - Win rate for that day

### TradingActivity
Stores individual trades:
- `crypto` - Cryptocurrency symbol (BTC, ETH, etc.)
- `action` - BUY or SELL
- `amount` - Amount traded
- `profit` - Profit from the trade (null for BUY)
- `status` - completed, pending, etc.
- `timestamp` - When the trade occurred

### PortfolioAllocation
Stores asset distribution:
- `asset` - Asset name (Bitcoin, Ethereum, etc.)
- `percentage` - Allocation percentage
- `value` - Value in USDT (optional)
- `updatedAt` - Last update time

## Real-Time Updates

All data refreshes every 10 seconds on the "Our Works" page. Users see:
- Live stats from admin updates
- Latest trades added to the system
- Current portfolio allocation
- Monthly performance calculated from daily records

## Admin Panel Access

- **Trading Control**: `/admin/trading-control` - Main stats management
- **Trading Data**: `/admin/trading-data` - Trades, portfolio, prices
- **Dashboard Sidebar**: "Trading Control" and "Trading Data" menu items

## Quick Commands

**Add Sample Data:**
- POST `/api/admin/trading-data/init?action=init`

**Get Monthly Performance:**
- GET `/api/admin/trading-data/monthly`

**Add Trade:**
- POST `/api/admin/trading-data` with type=`activity`

**Update Portfolio:**
- POST `/api/admin/trading-data` with type=`portfolio`

**Get Stats:**
- GET `/api/admin/trading-stats`

All data is production-grade, database-backed, and fully admin-controlled!
