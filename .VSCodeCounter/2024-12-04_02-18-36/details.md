# Details

Date : 2024-12-04 02:18:36

Directory /Users/omkar/Documents/Project/reservation_app

Total : 57 files,  26979 codes, 207 comments, 664 blanks, all 27850 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 7 | 0 | 2 | 9 |
| [backend/Dockerfile](/backend/Dockerfile) | Docker | 7 | 2 | 6 | 15 |
| [backend/controllers/courtController.js](/backend/controllers/courtController.js) | JavaScript | 167 | 16 | 50 | 233 |
| [backend/controllers/google_passport.js](/backend/controllers/google_passport.js) | JavaScript | 39 | 2 | 6 | 47 |
| [backend/controllers/groundController.js](/backend/controllers/groundController.js) | JavaScript | 120 | 15 | 23 | 158 |
| [backend/controllers/reservationController.js](/backend/controllers/reservationController.js) | JavaScript | 94 | 11 | 31 | 136 |
| [backend/controllers/userController.js](/backend/controllers/userController.js) | JavaScript | 128 | 19 | 36 | 183 |
| [backend/middlewares/authMiddleware.js](/backend/middlewares/authMiddleware.js) | JavaScript | 13 | 1 | 6 | 20 |
| [backend/models/Court.js](/backend/models/Court.js) | JavaScript | 42 | 1 | 3 | 46 |
| [backend/models/Ground.js](/backend/models/Ground.js) | JavaScript | 24 | 0 | 3 | 27 |
| [backend/models/Reservation.js](/backend/models/Reservation.js) | JavaScript | 41 | 1 | 3 | 45 |
| [backend/models/User.js](/backend/models/User.js) | JavaScript | 16 | 0 | 3 | 19 |
| [backend/package-lock.json](/backend/package-lock.json) | JSON | 1,229 | 0 | 1 | 1,230 |
| [backend/package.json](/backend/package.json) | JSON | 23 | 0 | 1 | 24 |
| [backend/routes/courtRoutes.js](/backend/routes/courtRoutes.js) | JavaScript | 10 | 1 | 3 | 14 |
| [backend/routes/groundRoutes.js](/backend/routes/groundRoutes.js) | JavaScript | 8 | 4 | 7 | 19 |
| [backend/routes/reservationRoutes.js](/backend/routes/reservationRoutes.js) | JavaScript | 8 | 4 | 5 | 17 |
| [backend/routes/userRoutes.js](/backend/routes/userRoutes.js) | JavaScript | 10 | 4 | 8 | 22 |
| [backend/server.js](/backend/server.js) | JavaScript | 27 | 4 | 10 | 41 |
| [docker-compose.yml](/docker-compose.yml) | YAML | 32 | 0 | 6 | 38 |
| [frontend/Dockerfile](/frontend/Dockerfile) | Docker | 7 | 2 | 8 | 17 |
| [frontend/README.md](/frontend/README.md) | Markdown | 2 | 0 | 1 | 3 |
| [frontend/package-lock.json](/frontend/package-lock.json) | JSON | 19,642 | 0 | 1 | 19,643 |
| [frontend/package.json](/frontend/package.json) | JSON | 58 | 0 | 1 | 59 |
| [frontend/public/index.html](/frontend/public/index.html) | HTML | 20 | 23 | 1 | 44 |
| [frontend/public/manifest.json](/frontend/public/manifest.json) | JSON | 25 | 0 | 1 | 26 |
| [frontend/src/App.css](/frontend/src/App.css) | CSS | 33 | 0 | 6 | 39 |
| [frontend/src/App.js](/frontend/src/App.js) | JavaScript | 27 | 0 | 6 | 33 |
| [frontend/src/App.test.js](/frontend/src/App.test.js) | JavaScript | 7 | 0 | 2 | 9 |
| [frontend/src/assets/facility/index.js](/frontend/src/assets/facility/index.js) | JavaScript | 3 | 1 | 1 | 5 |
| [frontend/src/assets/icons/index.js](/frontend/src/assets/icons/index.js) | JavaScript | 15 | 3 | 5 | 23 |
| [frontend/src/components/Header.js](/frontend/src/components/Header.js) | JavaScript | 78 | 1 | 12 | 91 |
| [frontend/src/components/Search.js](/frontend/src/components/Search.js) | JavaScript | 51 | 0 | 7 | 58 |
| [frontend/src/css/AuthPage.css](/frontend/src/css/AuthPage.css) | CSS | 292 | 2 | 51 | 345 |
| [frontend/src/css/FacilityOwnerProfile.css](/frontend/src/css/FacilityOwnerProfile.css) | CSS | 108 | 12 | 19 | 139 |
| [frontend/src/css/Header.css](/frontend/src/css/Header.css) | CSS | 65 | 6 | 16 | 87 |
| [frontend/src/css/HomePage.css](/frontend/src/css/HomePage.css) | CSS | 98 | 1 | 15 | 114 |
| [frontend/src/css/LandingPage.css](/frontend/src/css/LandingPage.css) | CSS | 144 | 10 | 32 | 186 |
| [frontend/src/css/RegisterGround.css](/frontend/src/css/RegisterGround.css) | CSS | 169 | 2 | 30 | 201 |
| [frontend/src/css/ReservationPage.css](/frontend/src/css/ReservationPage.css) | CSS | 188 | 12 | 38 | 238 |
| [frontend/src/css/ReserveeProfile.css](/frontend/src/css/ReserveeProfile.css) | CSS | 108 | 13 | 21 | 142 |
| [frontend/src/css/Search.css](/frontend/src/css/Search.css) | CSS | 31 | 0 | 4 | 35 |
| [frontend/src/index.css](/frontend/src/index.css) | CSS | 12 | 0 | 2 | 14 |
| [frontend/src/index.js](/frontend/src/index.js) | JavaScript | 11 | 0 | 2 | 13 |
| [frontend/src/logo.svg](/frontend/src/logo.svg) | XML | 1 | 0 | 0 | 1 |
| [frontend/src/pages/AuthPage.js](/frontend/src/pages/AuthPage.js) | JavaScript | 150 | 8 | 20 | 178 |
| [frontend/src/pages/FacilityOwnerProfile.js](/frontend/src/pages/FacilityOwnerProfile.js) | JavaScript | 89 | 2 | 17 | 108 |
| [frontend/src/pages/HomePage.js](/frontend/src/pages/HomePage.js) | JavaScript | 173 | 6 | 30 | 209 |
| [frontend/src/pages/LandingPage.js](/frontend/src/pages/LandingPage.js) | JavaScript | 78 | 0 | 13 | 91 |
| [frontend/src/pages/RegisterGround.js](/frontend/src/pages/RegisterGround.js) | JavaScript | 214 | 2 | 36 | 252 |
| [frontend/src/pages/ReservationPage.js](/frontend/src/pages/ReservationPage.js) | JavaScript | 226 | 11 | 33 | 270 |
| [frontend/src/pages/ReserveeProfile.js](/frontend/src/pages/ReserveeProfile.js) | JavaScript | 87 | 1 | 13 | 101 |
| [frontend/src/reportWebVitals.js](/frontend/src/reportWebVitals.js) | JavaScript | 12 | 0 | 2 | 14 |
| [frontend/src/setupTests.js](/frontend/src/setupTests.js) | JavaScript | 1 | 4 | 1 | 6 |
| [generate.js](/generate.js) | JavaScript | 6 | 0 | 2 | 8 |
| [package-lock.json](/package-lock.json) | JSON | 2,690 | 0 | 1 | 2,691 |
| [package.json](/package.json) | JSON | 13 | 0 | 1 | 14 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)