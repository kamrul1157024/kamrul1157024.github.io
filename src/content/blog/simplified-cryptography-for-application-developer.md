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
description: let's understand bit of cryptography
---

## Table of contents

## Cryptography Concepts

When we talk about cryptography we talk about three things

- Encryption and Decryption
- Hashing
- Signing

### Encryption and Decryption

- **Symmetric**: In symmetric encryption we only have one secret, We encrypt data with one secret and decrypt it with the same secret.
- **Asymmetric**: In asymmetric encryption we encrypt data with public key, and decrypt data with private key. A user can share its public key with everyone. If anyone wants to send data to the user they are going to encrypt the data with public key and send it to the user. Then user will be able to decrypt the data with his private key.

Symmetric Encryption and Decryption is faster than Asymmetric Encryption and Decryption.

### Hashing

In hashing we pass the data to a function it produce some output based on hashing function. It will produce same output for same data and same hashing function.Hash function are generally one way, this means you can get the data back from the hash function. You can possibly try all possible combination of data that produce this hash. Weak hash function can be cracked this way. Which make them vulnerable.With current computing power we can crack md5 hash function.

### Signing

A data can be signed with private key. Then the public key will be shared with everyone. And anyone can validate the signature using the public key.

## Cryptography Application:

### HTTPS(TLS)

In HTTPS we share the secret key of symmetric encryption using asymmetric encryption as symmetric encryption is faster than asymmetric encryption.

Let's say User1 want to send some data to User2,

&emsp; **|>Step 1:** User 2 ---Public Key ---> User 1

&emsp; **|>Step 2:** User 1 generates random secret

&emsp; **|>Step 3:** User 1 Encrypt the random secret with User 2 public key

&emsp; **|>Step 4:** User 1 ---Encrypted Data---> User 2

&emsp; **|>Step 5:** User 2 decrypt the data with his private key Get the secret

&emsp; **|>Step 6:** User 1 Sends the data encrypting it with shared secret and User 2 will be able to decrypt it

This is not still secure, this technic is prone to **man in the middle** attack.

Let's Say we have a malicious user interrupting our network traffic,

&emsp; **|> Step 1:** User 2 ---Public Key(User 1) ---> Malicious User

&emsp; **|> Step 2:** Malicious User ---Public Key(Malicious User) ---> User 1

&emsp; **|> Step 3:** User 1 Encrypt the random secret with Malicious public key

&emsp; **|> Step 4:** User 1 ---Encrypted Data---> Malicious User

&emsp; **|> Step 5:** Malicious User decrypt the data with his private key Get the secret

&emsp; **|> Step 6:** Malicious User creates it own secret and encrypt it with user 2 public key.

&emsp; **|> Step 7:** Malicious User ---Encrypted Data---> User 2

&emsp; **|> Step 8:** User 2 decrypt the data with it's private key and will thought it received the secret key of the user 1. Now malicious user will receive all of the traffic from user 1, decrypt it with shared secret with user 1 then it will encrypt it with shared secret with user 2 and send it to user 2. Now malicious user will be able to see all the data traffic between user 1 and user 2.

<br>

This problem is occurred because the User 2 does not recognize the public key of user 1. User 2 can contact with all of the user it will be contacting and gather their public keys. But this solution is not feasible. Other solution is we can have trusted party. The trusted party is trusted by all. Everyone knows their public key and browsers comes with those public key pre defined.The trusted party Sign the public key with their private key. And the user will be able to validate the certificate ownership using the trusted parties public key.This top level trusted parties are known as root CA.

### HMAC
