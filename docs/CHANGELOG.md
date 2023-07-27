# [1.1.0](https://github.com/brumaire-agency/howdusty/compare/v1.0.0...v1.1.0) (2023-07-27)


### Bug Fixes

* ignore github bots in onlydust import ([#87](https://github.com/brumaire-agency/howdusty/issues/87)) ([d1b99ab](https://github.com/brumaire-agency/howdusty/commit/d1b99abe8858600c75ba579d617c65334cc26291))
* onlydust import failing command ([#77](https://github.com/brumaire-agency/howdusty/issues/77)) ([8b673b2](https://github.com/brumaire-agency/howdusty/commit/8b673b2f81562f1970512993828bb6296a1701e2))
* the synchronization command fails to fetch user info in parallel ([#91](https://github.com/brumaire-agency/howdusty/issues/91)) ([4094806](https://github.com/brumaire-agency/howdusty/commit/4094806f376637194695789188f35b9334e62e3a))
* update onlydust import command ([#64](https://github.com/brumaire-agency/howdusty/issues/64)) ([be0ba5d](https://github.com/brumaire-agency/howdusty/commit/be0ba5d3e81d8abf4c39bf8d6c1b5538cd68a3a7))


### Features

* add an endpoint for reading a contributor by its username ([#79](https://github.com/brumaire-agency/howdusty/issues/79)) ([75c595b](https://github.com/brumaire-agency/howdusty/commit/75c595b827b447f51ad1ea0d4dcbba896db4bdc5))
* add collected grant metric ([#72](https://github.com/brumaire-agency/howdusty/issues/72)) ([85fd53d](https://github.com/brumaire-agency/howdusty/commit/85fd53de5903d9c59611e4349768f1bad1642f30))
* add contributed project count metric ([#81](https://github.com/brumaire-agency/howdusty/issues/81)) ([71e5cd8](https://github.com/brumaire-agency/howdusty/commit/71e5cd81a6219240d8164dfe2a48909e197b4719))
* add mean grant per project metric ([#80](https://github.com/brumaire-agency/howdusty/issues/80)) ([edc2676](https://github.com/brumaire-agency/howdusty/commit/edc2676d05b0846f9341aba4b68eb42d72c12c11))
* add mission count metric ([#82](https://github.com/brumaire-agency/howdusty/issues/82)) ([8d80758](https://github.com/brumaire-agency/howdusty/commit/8d807584c44d4663c33158d529cf7c8abb9af822))
* add onlydust api ([#57](https://github.com/brumaire-agency/howdusty/issues/57)) ([45d01d6](https://github.com/brumaire-agency/howdusty/commit/45d01d66edbea9350d142bc86d225113079fa6a5))
* add Onlydust import command ([#60](https://github.com/brumaire-agency/howdusty/issues/60)) ([88de3ab](https://github.com/brumaire-agency/howdusty/commit/88de3ab4ff4b5daace862fbabdc88ba1d26e34e8))
* separate the user model and its metrics in 2 tables ([#92](https://github.com/brumaire-agency/howdusty/issues/92)) ([0a20913](https://github.com/brumaire-agency/howdusty/commit/0a20913c63d4d57fe8b41e73ff21e2b739d58e05))
* synchronize all users by default ([#58](https://github.com/brumaire-agency/howdusty/issues/58)) ([f8f86aa](https://github.com/brumaire-agency/howdusty/commit/f8f86aa289a3ef057348837bf5b7699948a285be))
* the synchronization command fails past a given number of users ([#89](https://github.com/brumaire-agency/howdusty/issues/89)) ([2eb4fd2](https://github.com/brumaire-agency/howdusty/commit/2eb4fd2aae7c756837c000d29b1b68afd9eee48a))

# 1.0.0 (2023-06-20)


### Bug Fixes

* add aliases and update imports ([#14](https://github.com/brumaire-agency/howdusty/issues/14)) ([be2a301](https://github.com/brumaire-agency/howdusty/commit/be2a301c242e2870acd20f88cfa4114f48a1d6c4))
* add metrics logic ([#18](https://github.com/brumaire-agency/howdusty/issues/18)) ([9d1a9ba](https://github.com/brumaire-agency/howdusty/commit/9d1a9ba76bb80ae944396c34ff6c9bd69de38a0a))
* contributor score command failing on second run ([#50](https://github.com/brumaire-agency/howdusty/issues/50)) ([de60875](https://github.com/brumaire-agency/howdusty/commit/de6087550e8fb806b82c59d3c467c9a3717f8d86))
* failing normalization tests ([#53](https://github.com/brumaire-agency/howdusty/issues/53)) ([4b79efc](https://github.com/brumaire-agency/howdusty/commit/4b79efca2a1304803859d0cb9cc10a8b3c8b7204))
* github user name can be nullable ([#49](https://github.com/brumaire-agency/howdusty/issues/49)) ([0660264](https://github.com/brumaire-agency/howdusty/commit/06602647b786a6be187eebd927fce547fae61116))
* update issue pull request ratio metric ([#41](https://github.com/brumaire-agency/howdusty/issues/41)) ([bb3aa5f](https://github.com/brumaire-agency/howdusty/commit/bb3aa5f8ada6047f7fc570c4b59bb3dd12f77097))


### Features

* active contribution weeks metric ([#39](https://github.com/brumaire-agency/howdusty/issues/39)) ([23adb76](https://github.com/brumaire-agency/howdusty/commit/23adb760e7a68739422103ffb5930c0944cf0204))
* add contributor entity ([#6](https://github.com/brumaire-agency/howdusty/issues/6)) ([c971087](https://github.com/brumaire-agency/howdusty/commit/c9710874712f8a935061f8b55dd328e8375ecf75))
* add contributors controller and test ([#42](https://github.com/brumaire-agency/howdusty/issues/42)) ([f76dd1b](https://github.com/brumaire-agency/howdusty/commit/f76dd1b8b6b803f802acbd953c9eb279ff19c3e2))
* add github graphql api ([#10](https://github.com/brumaire-agency/howdusty/issues/10)) ([9265614](https://github.com/brumaire-agency/howdusty/commit/9265614bea706ffdad47cee95bdd125788e21578))
* add normalization capability ([#33](https://github.com/brumaire-agency/howdusty/issues/33)) ([a016ddf](https://github.com/brumaire-agency/howdusty/commit/a016ddf0448fc6332b3dc354c573c89210e389b1))
* add scorer service ([#35](https://github.com/brumaire-agency/howdusty/issues/35)) ([0875832](https://github.com/brumaire-agency/howdusty/commit/0875832dd49c5a06eff4889ee5768ce571fcbda9))
* add scoring command ([#37](https://github.com/brumaire-agency/howdusty/issues/37)) ([1e73ec1](https://github.com/brumaire-agency/howdusty/commit/1e73ec1251e7cf70dc617dad00f924f85641be7b))
* add total contributions ([#16](https://github.com/brumaire-agency/howdusty/issues/16)) ([8cd56ce](https://github.com/brumaire-agency/howdusty/commit/8cd56ce8628cecbff5f96626444b0a14ee337755))
* command module ([#13](https://github.com/brumaire-agency/howdusty/issues/13)) ([b0393f2](https://github.com/brumaire-agency/howdusty/commit/b0393f246f2438d6dc4098a1753e05d6a3cc1ca5))
* contributed repository count metric ([#31](https://github.com/brumaire-agency/howdusty/issues/31)) ([970ab48](https://github.com/brumaire-agency/howdusty/commit/970ab48c589b8082306c9bc34c5b2e29b7cc2003))
* issue paull request ratio metric ([#34](https://github.com/brumaire-agency/howdusty/issues/34)) ([4e0b17d](https://github.com/brumaire-agency/howdusty/commit/4e0b17d87617c8ac31679f0755da43068ed69dd4))
* refacto metrics ([#46](https://github.com/brumaire-agency/howdusty/issues/46)) ([ed6061e](https://github.com/brumaire-agency/howdusty/commit/ed6061ee06bd47e365b86fbd173955e7a198d341))
* repository maintained count metric ([#32](https://github.com/brumaire-agency/howdusty/issues/32)) ([674852a](https://github.com/brumaire-agency/howdusty/commit/674852a9a99b80b9b13b98e116c5b51ef09eaf3b))
* synchronization module ([#11](https://github.com/brumaire-agency/howdusty/issues/11)) ([fdf0828](https://github.com/brumaire-agency/howdusty/commit/fdf0828405c80414e92415978efd88373f37e300))
* update readme ([#5](https://github.com/brumaire-agency/howdusty/issues/5)) ([d052ecf](https://github.com/brumaire-agency/howdusty/commit/d052ecf39c01ee2bc933b4e8f893c40de66d8708))
* update total contributions ([#17](https://github.com/brumaire-agency/howdusty/issues/17)) ([3c460c3](https://github.com/brumaire-agency/howdusty/commit/3c460c34446b132dbde2f461c0e823d36609806b))
