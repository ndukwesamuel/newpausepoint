# Mobile: APIs still on the old server

**1 call** in the mobile app still goes to the old server. Last checked:
**2026-10-21**.

### Wallet
| Method | Path | Where |
|---|---|---|
| POST | `/wallet/fund` | `screens/Customerinterface/Wallet/FundWalletScreen.js:118` (hard-coded to `uneven-tarrah-pausepoint-950a7a7b.koyeb.app`) |

Card top-up through Paystack. Kept on the old server on purpose: the new
server has no Paystack payment or wallet-crediting code yet. Bank-transfer
funding on the same screen already uses the new server.
