#### 2.0.3 (2018-04-30)

##### Bug Fixes

* **resolver:**  fix in empty results ([adabc21b](https://github.com/growlerapp/api/commit/adabc21b850ca54af0b6b0f6e294670946b8c929))

#### 2.0.2 (2018-04-30)

##### Chores

* **query:**  add _id ([f30bba86](https://github.com/growlerapp/api/commit/f30bba86c2a77baf94792acdc074da96202c059d))

##### New Features

* **proximity:**  add max_distance ([448843a9](https://github.com/growlerapp/api/commit/448843a92dc1d15ce466178bba35ec16a2bb5d53))

#### 2.0.1 (2018-04-29)

##### Chores

* **package:**  update dependencies ([d961167c](https://github.com/growlerapp/api/commit/d961167c77aecea8e67bc823d41814cdd71f0a40))
* **docker:**  update docker files ([9030e145](https://github.com/growlerapp/api/commit/9030e145cfbb6f72635dd92bfbc2f10c47929a2a))

##### Bug Fixes

* **query:**  add GraphQLNonNull to args required ([fc530652](https://github.com/growlerapp/api/commit/fc5306522259ee6c275a5412f534dc2c0cfbb5fc))

## 2.0.0 (2018-04-23)

##### Breaking Changes

* **query:**  change type of findByProximity ([527eb0cc](https://github.com/growlerapp/api/commit/527eb0cc5dbfecc31a516eafab702958ab15893d))

##### Chores

* **codeclimate:**  add .codeclimate ([a700b440](https://github.com/growlerapp/api/commit/a700b440ba0cebd78f1ba785a4e7fd1c456bccec))

##### Continuous Integration

* **deploy:**  add build-args in docker build ([9701aef6](https://github.com/growlerapp/api/commit/9701aef6b879d39d75b35a28eac1f67430deada4))

##### New Features

* **utils:**  add parseMatrixResults ([2bca5635](https://github.com/growlerapp/api/commit/2bca5635c9d84ea745d1c010c0dfb23b380c380b))
* **models:**
  *  add findByProximity static method ([c01b8ea5](https://github.com/growlerapp/api/commit/c01b8ea5ad98f6f8dfa8f6e7dd6327d44de9ba64))
  *  add index 2dsphere ([c57b7b91](https://github.com/growlerapp/api/commit/c57b7b91c570e9c3419a4e2b00e6afec5b422525))
* **types:**  add SimpleMatrix type ([9c571fa0](https://github.com/growlerapp/api/commit/9c571fa0ebffc542d54d35879c6ea511a13e1daa))

### 1.2.0 (2018-04-20)

##### Documentation Changes

* **readme:**  add badges ([b08fb8f8](https://github.com/growlerapp/api/commit/b08fb8f89483003eb8b4d6ccbfdfbebc04bd27b6))

##### New Features

* **query:**  add findByProximity ([ae3374e4](https://github.com/growlerapp/api/commit/ae3374e46fc4c715e8454286ace3098ef9fbbde5))
* **types:**  add distance matrix types ([299293e9](https://github.com/growlerapp/api/commit/299293e90d28403accb64a36aae92a5a54b891bb))
* **utils:**  complete matrix util ([8870bc10](https://github.com/growlerapp/api/commit/8870bc102847ad3992ba0bde7f3ba974ad572bd7))

##### Code Style Changes

* **js:**  fix format source ([0503b66c](https://github.com/growlerapp/api/commit/0503b66c608de4e3affec48a124297a141d20d48))

### 1.1.0 (2018-04-20)

##### New Features

* **args:**  add filter data by address ([8d77c188](https://github.com/growlerapp/api/commit/8d77c1881063c82f31876a2674d0b8e419ccad08))

## 1.0.0 (2018-04-20)

##### Chores

* **scripts:**  add initdb script ([23257f53](https://github.com/growlerapp/api/commit/23257f5301798fdb433aeacd8c880acc70496f38))
* **docker:**  update docker files ([36d7e3dc](https://github.com/growlerapp/api/commit/36d7e3dc2fb13c10a31a6cd4e3725cf0ed2ab70b))
* **package:**  fix scripts and keywords ([5573321d](https://github.com/growlerapp/api/commit/5573321d71760abea1c4d3bf2b5f5756925e1f0f))
* **git:**  add .gitignore ([7033e177](https://github.com/growlerapp/api/commit/7033e17706334cf69a2597341f47109f3ed52c09))

##### Continuous Integration

* **travis:**  enable travis ([33e557aa](https://github.com/growlerapp/api/commit/33e557aacec5789ccd011fd2638829e2afc56ff1))

##### Documentation Changes

* **readme:**  add readme ([ed869009](https://github.com/growlerapp/api/commit/ed8690099d7d0422bca0cb8daebd40647abfa47c))

##### Bug Fixes

* **express:**  set app port ([a3dd424e](https://github.com/growlerapp/api/commit/a3dd424e4f0bfcceca2b2b6fbfe27e1162bf266b))

##### Code Style Changes

* **js:**  fix format ([e00b3df5](https://github.com/growlerapp/api/commit/e00b3df50c46aae58b9733f38d114b5c5d52d688))

##### Tests

* **test:**  add tests ([0f2a03a4](https://github.com/growlerapp/api/commit/0f2a03a44dbf6dabd334a614890e6d3792fbc43c))

