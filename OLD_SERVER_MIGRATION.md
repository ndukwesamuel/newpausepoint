# Mobile: old server migration

Tracks which mobile app calls still go to the **old (V1) server** and what has
already moved to the **new (V2) server**. Last checked: **2026-10-21**.

| | URL | Code |
|---|---|---|
| **New (V2)** | `https://communist-carla-pausepoint-fb082012.koyeb.app/` | `pausepointbackend` repo |
| **Old (V1)** | `https://pausepointbackend.onrender.com/` (store builds, set in `eas.json`) | not in this workspace |
| **Old (V1), second copy** | `https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/` (local `.env`, and hard-coded in one file) | same as above |

The two old URLs answer identically. The mobile app is the only thing still
using them, so the old server can't be switched off until everything under
[Still on the old server](#still-on-the-old-server) is moved.

**Status: 31 calls still go to the old server.**

## How the mobile app picks a server

| Code | Server |
|---|---|
| `API_CONFIG.BASE_URL` from `api.ts` / `hooks/api.ts` | ✅ New |
| `hooks/Requestv2.ts` (`useFetchData_v2`, `useMutateData_v2`, `useFormDataMutate`) | ✅ New |
| `process.env.EXPO_PUBLIC_API_URL` | ❌ Old |
| `hooks/Request.js` (`useFetchData`, `useMutateData`, …) | ❌ Old |

Calls on the new server use the token from `state.authSlice.userDatav2.data.token`.
Login (`loginUser`, `signin-v2`) never fills the old `state.AuthSlice.user_data`,
so **old-server calls that read `AuthSlice.user_data.token` send no token after
a fresh login**. Screens using them may already be failing for most users.

To move a call: point it at `API_CONFIG.BASE_URL` + the V2 path, switch it to
the `authSlice.userDatav2` token, and add the V2 route if it doesn't exist.

## Fixed

| Date | What | Commit |
|---|---|---|
| 2026-10-21 | **Public events removed** (`EventSlice`, create public/private event, public event details): 8 old calls gone. Resident events kept. | `e44af37` |
| 2026-10-21 | **Estate/clan moved.** `GET /clan/:id` now calls V2 `GET api/v1/clan/estate/:clanId` (estate admins only; backend `aef2a2a`). Unused clan calls removed: `/clan`, `/clan/getMember`, `/clan/getMember/:id`, `/clan/getuserclans`, `/clan/Admingetuserclans`, `POST /clan`. | `e44af37` |
| 2026-10-21 | All Users screen read the estate ID from the wrong place and asked for no estate | `e44af37` |
| 2026-10-21 | **Resident events removed**: 7 old calls gone. Deleted the user and admin event screens (`MainEvent`, `AdminMainEvent`, `CreateMainEvent`, event details) and `MainEventSlice` / `AdminMainEventSlice`. Nothing in the app opened these screens, and only 4 events were ever created (last July 2024, test estates). The `residentevents` data is left in the database. | `sep21`, commit that adds this line |
| 2026-10-21 | **Services/vendors replaced by V2 artisans**: 8 old calls gone. Residents already used artisans (`service` → `vendorService`). The admin **Service** screens now list, add, delete and show ratings for artisans via `api/v1/artisan/admin…`. Old vendor records (27, test estates, last added May 2025) are no longer shown. Backend: artisans were hard-coded to Captain's Court with no admin check; now scoped to the caller's estate, and add/edit/delete need a level 1/2 admin. | backend `6fa9cba`, web `d37c402`, mobile: `sep21`, commit that adds this line |

These only reach users after a **new app build** is released.

## Still on the old server

31 distinct calls in the mobile app, grouped by feature. Paths are relative
to the old server.

### App start and sign-in
| Method | Path | Where |
|---|---|---|
| GET | `/checkversion?version=` | `App.js:340` |
| POST | `/send-otp` | `screens/OTP.js:58` |
| POST | `/verify-otp` | `screens/OTP.js:88` |
| POST | `/api/v1/user/login` | `Redux/AuthSlice.js:24`: **unused** (`Login_Fun` is never dispatched); delete instead of moving |

### Users and profile (admin)
| Method | Path | Where |
|---|---|---|
| GET | `/users` | `Redux/Admin/UserSlice.ts:97` |
| GET | `/user/:id` | `Redux/Admin/UserSlice.ts:49` |
| PUT | `/profile/update` | `screens/AdminInterface/Account/EditPersonalInformation.js:92` |

### Visitors, guests and domestic staff
| Method | Path | Where |
|---|---|---|
| GET | `/visitor/invites` | `Redux/UserSide/GuestSlice.js:54` |
| GET | `/visitor/invites/:clanId` | `Redux/Admin/AdminGuestSlice.js:56` |
| GET | `/visitor/:id` | `Redux/UserSide/GuestSlice.js:116`, `Redux/Admin/AdminGuestSlice.js:121` |
| PATCH | `/visitor/modify/:id` | `screens/AdminInterface/Guest/CreateGuests.js:141` |
| PATCH | `/visitor/generate-access-code/:clanId` | `screens/AdminInterface/Guest/CreateGuests.js:145` |
| GET | `/domesticstaff` | `Redux/UserSide/GuestSlice.js:86` |
| GET | `/domesticstaff/admin` | `Redux/Admin/AdminGuestSlice.js:89` |

### Emergency
| Method | Path | Where |
|---|---|---|
| GET | `/emargencyreport` | `Redux/Admin/EmergencySlice.js:44` |
| GET | `/emargencyreport/:id` | `Redux/Admin/EmergencySlice.js:70`, `Redux/Admin/AdminServiceSlice.js:27` |
| GET | `/emargencyreport/resolve-emergency/:id` | `screens/AdminInterface/Emergency/EmergencyDetails.js:160` |

### Announcements and polls
| Method | Path | Where |
|---|---|---|
| GET | `/forum/admin-announcement` | `Redux/Admin/AdminForumSlice.js:46` |
| POST | `/poll` | `screens/AdminInterface/Poll/CreatePoll.js:52` |
| DELETE | `/poll/:id` | `screens/AdminInterface/Poll/AdminUserPollDetail.js:43` |

### Marketplace and amenities
| Method | Path | Where |
|---|---|---|
| GET | `/market/products` | `Redux/UserSide/MarketSLice.js:53` |
| GET | `/market/myproduct` | `Redux/UserSide/MarketSLice.js:81` |
| GET | `/market/category/all` | `Redux/UserSide/MarketSLice.js:107` |
| GET | `/market/allclanproducts` | `Redux/Admin/AdminMarketSLice.js:91` |
| PUT | `/market/product/status/:id` | `screens/AdminInterface/MarketPlace/ProductDetails.js:40`, `screens/AdminInterface/Amentities/CreateAmeneties.js:35`, `screens/Customerinterface/Amentities/CreateAmeneties.js:51` |
| GET | `/amenities` | `Redux/Admin/AdminMarketSLice.js:57` |
| GET | `/amenities/all` | `Redux/Admin/AdminMarketSLice.js:54` |
| POST | `/amenities` | `screens/AdminInterface/Amentities/Amenities.js:62` |
| DELETE | `/amenities/:id` | `screens/AdminInterface/Amentities/Amenities.js:98` |

### Wallet and errands
| Method | Path | Where |
|---|---|---|
| POST | `/wallet/fund` | `screens/Customerinterface/Wallet/FundWalletScreen.js:118`: **hard-coded** to `uneven-tarrah`, so store builds use it too |
| POST | `/wallet` | `screens/AdminInterface/Wallet/FundWalletScreen.js:24` (via `hooks/Request.js`) |
| POST | `/api/v1/general/pickUp` | `components/Errand/PickupErrandScreen.js:335` (via `hooks/Request.js`) |
| PATCH | `/api/v1/guesterrand` | `screens/Customerinterface/Errands/ErrandDetailScreen.js:29` (via `hooks/Request.js`) |

## Other problems found

Not old-server calls, but found during the audit and not fixed yet.

| Problem | Where | Impact |
|---|---|---|
| Address update crashes: `API_BASEURL` is never defined | `screens/Customerinterface/Account/AddressComponent.jsx:34` | Updating an address fails before any request is sent |
| Paystack secret key is in `.env` as `EXPO_PUBLIC_…`, so it's bundled into the app | `.env` | Test key today; the live key must never go there |
| Store builds and local builds point at different old servers | `eas.json` (onrender) vs `.env` (koyeb) | A bug can show on phones but not in local testing, or the other way round |

## Suggested order

1. **Visitors and guests**: daily use at the gate.
2. **Emergency**.
3. **OTP and version check**: every user hits these.
4. **Wallet funding**: money; also remove the hard-coded URL.
5. Users/profile, announcements and polls.
6. Marketplace, amenities, errands.
7. Delete `hooks/Request.js`, the `EXPO_PUBLIC_API_URL` lines in `.env` and `eas.json`, and the unused `Login_Fun`.
8. Release a new app build, wait for users to update, then switch the old server off.

## Re-checking

Search the mobile app for live uses of the old server:

```sh
grep -rnE "EXPO_PUBLIC_API_URL|hooks/Request['\"]|uneven-tarrah|pausepointbackend\.onrender" \
  --exclude-dir=node_modules . | grep -vE ":[0-9]+:\s*//"
```

Update this file when a group is moved.
