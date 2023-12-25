# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.1.0 (2023-11-29)


### ⚠ BREAKING CHANGES

* **api:** remove totalCost, totalRevenue and totalHours from Get ProjectSummary API Response
* **api:** rename fields for clarity in resource allocation in the Get Project Summary response
* **api:** add resource allocation details to project summary response
* **api:** add project details to the summary api response
* **api:** change the response structure of all the apis
* **db:** add relation mapping for estimate-related tables in prisma schema
* **db:** rename prisma mapping of estimate, project and employee related tables
* **db:** rename prisma mapping of estimates table

### Features

* add status list ([9c1b481](https://gitlab.softway.com/bitool/bitool-backend/commit/9c1b481f2d437b1daf80c83a4f1da627a8c29469))
* **api:** add hourly cost to resource allocation details ([a46b254](https://gitlab.softway.com/bitool/bitool-backend/commit/a46b25492e2858998432de0bbc101b9196dad4f3))
* **api:** add project details to the summary api response ([56a4499](https://gitlab.softway.com/bitool/bitool-backend/commit/56a4499e39c21b8ab4091972d93d28a1b788e9b7))
* **api:** add resource allocation details to project summary response ([c4b550d](https://gitlab.softway.com/bitool/bitool-backend/commit/c4b550d8752c67c9579141760b7c01826cff8e18))
* **api:** change the response structure of all the apis ([0ef37e0](https://gitlab.softway.com/bitool/bitool-backend/commit/0ef37e0cfb54039e36b290f258d44ce33237f4fe))
* **api:** implement actual data mapping for GET:/project/:projectId ([aef9807](https://gitlab.softway.com/bitool/bitool-backend/commit/aef980774f675eb0adaab71743ac9808417c0f9e))
* **api:** implement project task update api ([83e9ff5](https://gitlab.softway.com/bitool/bitool-backend/commit/83e9ff5451a2522472df3c0c4062bf337a394e73))
* **api:** introduce preliminary GET:/project/:projectId endpoint ([5021447](https://gitlab.softway.com/bitool/bitool-backend/commit/50214471b5ce05165cab4dc775e774122c809cbf))
* **api:** remove totalCost, totalRevenue and totalHours from Get ProjectSummary API Response ([883e465](https://gitlab.softway.com/bitool/bitool-backend/commit/883e465d796d8699ecf68fb4126dc6e51d2084d6))
* **api:** rename fields for clarity in resource allocation in the Get Project Summary response ([3bb7fcb](https://gitlab.softway.com/bitool/bitool-backend/commit/3bb7fcb87471932e0a54b64d9000df27acc1a104))
* change database mapping for statusType list ([65c8485](https://gitlab.softway.com/bitool/bitool-backend/commit/65c8485e9b6bdeb4f60dca3126812c477dff8944))
* **db:** add prisma migration for adding estimate line item status map table ([3861924](https://gitlab.softway.com/bitool/bitool-backend/commit/386192420b538364d3ae581f991874d8ad32bab3))
* **db:** add prisma migration for adding relation ship between status type and est line itm map ([a7a6ae6](https://gitlab.softway.com/bitool/bitool-backend/commit/a7a6ae6a8da144b6820bce41864f52f8484cd67c))
* **db:** add prisma migration for adding status column to estimate_line_items table ([78658f9](https://gitlab.softway.com/bitool/bitool-backend/commit/78658f97f803b634ce24bba6457af5cd417cc788))
* **db:** add prisma migration for adding status type table ([53e08aa](https://gitlab.softway.com/bitool/bitool-backend/commit/53e08aa745076237cc6a4cb2d43426d86ba05633))
* **db:** add prisma migration for adding unique constraint on estimate_line_items table ([1002ecc](https://gitlab.softway.com/bitool/bitool-backend/commit/1002eccab9f65886071a504d77e39002fc022da3))
* **db:** add prisma migration for adding unique constraint(uid, estimateid) on est lin ite stat map ([6be9112](https://gitlab.softway.com/bitool/bitool-backend/commit/6be911279ed8988013ad4fcb8a0f03fdab8c4367))
* **db:** add prisma migration for changing pk of status type table to uuid ([19565b3](https://gitlab.softway.com/bitool/bitool-backend/commit/19565b3d3a62d7558a7fed1c8b917b46e5a861de))
* **db:** add prisma migration for changing statusId of estimate line item status map table to uuid ([0e78d06](https://gitlab.softway.com/bitool/bitool-backend/commit/0e78d06dd03974b91495167cef296587b0ace8f5))
* **db:** add prisma migration for removing status field from estimate line items table ([9a4fb30](https://gitlab.softway.com/bitool/bitool-backend/commit/9a4fb30ab1f7637d49888f6fb90c2c69e80d9551))
* **db:** add relation mapping for estimate-related tables in prisma schema ([ee76956](https://gitlab.softway.com/bitool/bitool-backend/commit/ee76956c6c7dc9493dec4b7bea11695193a8b96b))
* **db:** add seed for status_type table ([b2eb170](https://gitlab.softway.com/bitool/bitool-backend/commit/b2eb1701760fe89c8a4ecaf2ce0f77c806338c6a))
* **db:** rename prisma mapping of estimate, project and employee related tables ([e059c3a](https://gitlab.softway.com/bitool/bitool-backend/commit/e059c3a26be8795d81b78371f8660f16a3ea93d2))
* **db:** rename prisma mapping of estimates table ([4bffbe1](https://gitlab.softway.com/bitool/bitool-backend/commit/4bffbe1e03e46c2e2a878b1e45f8216644708653))
* implement returning statusId with project summary get api ([7cb051a](https://gitlab.softway.com/bitool/bitool-backend/commit/7cb051a5260c1635d2b492f5dd7b3c445deabfb4))
* update status api fixed to working ([ce67bcd](https://gitlab.softway.com/bitool/bitool-backend/commit/ce67bcdbffb0d110abdd45e322962ece905e4641))


### Bug Fixes

* **db:** estimate_line_item table updateBy column name ([366030f](https://gitlab.softway.com/bitool/bitool-backend/commit/366030f909cf0b03cd57b86f87e99229090dd14d))
* **db:** revert prisma schema changes for fixing migration issues ([4460d92](https://gitlab.softway.com/bitool/bitool-backend/commit/4460d92a50e8ed5e1745be504a7a4fb3e3ba43d7))
* **db:** wrong colomn reference for oauth_access_tokens table ([6abe367](https://gitlab.softway.com/bitool/bitool-backend/commit/6abe367709c9f5bfdae3b30058bb4d1d81a63593))
* remove old status update api and fix project service linting issues ([8b48426](https://gitlab.softway.com/bitool/bitool-backend/commit/8b48426c7a15080d2ef63ea94060ffa7c39619e6))
* unable to update endDate alone for project task ([a1e7fbb](https://gitlab.softway.com/bitool/bitool-backend/commit/a1e7fbb26ce29b68a1cc76e0701f656bc15c05a2))
* update project task update api to set status to estimate line item status map table ([a79c935](https://gitlab.softway.com/bitool/bitool-backend/commit/a79c93535a3f73fe54bdbadec580570ed4969b7b))
