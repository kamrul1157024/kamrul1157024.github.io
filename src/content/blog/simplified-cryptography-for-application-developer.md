---
author: Kamrul
pubDatetime: 2022-04-09T15:22:00Z
title: Simplified Cryptography For Application Developer
postSlug: simplified-cryptography-for-application-developer.md
featured: true
draft: false
tags:
  - cryptography
ogImage: ""
description: Let's understand a bit of cryptography
---

## Table of contents

## Cryptography Concepts

When we talk about cryptography we talk about three things

- Encryption and Decryption
- Hashing
- Signing

### Encryption and Decryption

- **Symmetric**: In symmetric encryption we only have one secret, We encrypt data with one secret and decrypt it with the same secret.
- **Asymmetric**: In asymmetric encryption, we encrypt data with the public key and decrypt data with the private key. A user can share its public key with everyone. If anyone wants to send data to the user they are going to encrypt the data with the public key and send it to the user. Then user will be able to decrypt the data with his private key.

Symmetric Encryption and Decryption is faster than Asymmetric Encryption and Decryption.

### Hashing

In hashing, we pass the data to a function that produces some output based on the hashing function. It will produce the same output for the same data and the same hashing function. Hash functions are generally one-way, this means you can get the data back from the hash function. You can possibly try all possible combinations of data that produce this hash. The weak hash function can be cracked this way. Which makes them vulnerable. With current computing power, we can crack md5 hash function.

### Signing

Data can be signed with the private key. Then the public key will be shared with everyone. Anyone can validate the signature using the public key.

## Cryptography Application:

### HTTPS(TLS)

In HTTPS we share the secret key of symmetric encryption using asymmetric encryption as symmetric encryption is faster than asymmetric encryption.

Let's say User1 wants to send some data to User2,

&emsp; **|>Step 1:** User 2 ---Public Key ---> User 1

&emsp; **|>Step 2:** User 1 generates random secret

&emsp; **|>Step 3:** User 1 Encrypt the random secret with User 2 public key

&emsp; **|>Step 4:** User 1 ---Encrypted Data---> User 2

&emsp; **|>Step 5:** User 2 decrypts the data with his private key Get the secret

&emsp; **|>Step 6:** User 1 Sends the data encrypting it with shared secret and User 2 will be able to decrypt it

This is not still secure, this technique is prone to **man in the middle ** attack.

Let's Say we have a malicious user interrupting our network traffic,

&emsp; **|> Step 1:** User 2 ---Public Key(User 1) ---> Malicious User

&emsp; **|> Step 2:** Malicious User ---Public Key(Malicious User) ---> User 1

&emsp; **|> Step 3:** User 1 Encrypt the random secret with Malicious public key

&emsp; **|> Step 4:** User 1 ---Encrypted Data---> Malicious User

&emsp; **|> Step 5:** Malicious User decrypts the data with his private key Get the secret

&emsp; **|> Step 6:** Malicious User creates its own secret and encrypts it with user 2 public key.

&emsp; **|> Step 7:** Malicious User ---Encrypted Data---> User 2

&emsp; **|> Step 8:** User 2 decrypts the data with its private key and will think it received the secret key of user 1. Now the malicious user will receive all of the traffic from user 1, decrypt it with shared secret with user 1 then it will encrypt it with shared secret with user 2 and send it to user 2. Now malicious user will be able to see all the data traffic between user 1 and user 2.

<br>

This problem has occurred because User 2 does not recognize the public key of User 1. User 2 can contact all of the users it will be contacting and gathering their public keys. But this solution is not feasible. Another solution is we can have a trusted party. The trusted party is trusted by all. Everyone knows their public key and browsers come with those public keys pre-defined. The trusted party Signs the public key with their private key. The user will be able to validate the certificate ownership using the trusted parties' public key. These top-level trusted parties are known as root CA.

### HMAC
