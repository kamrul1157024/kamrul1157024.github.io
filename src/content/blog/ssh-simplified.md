---
author: Kamrul
pubDatetime: 2022-04-09T15:22:00Z
title: SSH Simplified
postSlug: ssh-simplified
featured: true
draft: false
tags:
  - ssh
ogImage: ""
description: ssh is simple, still people seems have no or wrong understanding of it
---

## Table of contents

## How SSH Works

In SSH, there are two keys, public(ex: id_rsa.pub) and private(ex: id_rsa). Keys are generated by the client who wants to access the remote server by running `ssh-keygen` in the client terminal. These keys will be generated and saved on the `~/.ssh` folder.

The client can share its public key with anyone. If a server wants to give access to the client, it can add the client public key to its `~/.ssh/authorized_keys` file.
the client can define the key generation algorithm and size using

```python
ssh-keygen -t <algorithm-name> -b <size in bits>
```

for example,

```python
ssh-keygen -t ecdsa -b 521
```

Generates ssh key using elliptical curve algorithm size of 521 bits.
SSH does not provide any logs about ssh connection failure to the client due to security implications. It is possible to view the logs in the remote server by running

```python
tail -f /var/log/auth.log
```

the remote server can change SSH configuration by editing `/etc/ssh/sshd_config` file.
Using ssh tunneling it is possible to do local and remote port forwarding.

## Local Port Forwarding

The client can forward its local port to a remote server port or any private port that the server has access to by running,

```python
ssh -L <client-port>:<server-ip-address>:<server-port> username@server_ip/domain
```

Ex-1: An app running on a remote server itself on 3000 port,

```python
ssh -L 3001:localhost:3000 user1@42.45.233.12
```

now accessing localhost:3001 in the client app is the same as accessing localhost:3000 on a remote server.

Ex-2: An app is running on a different machine of the private network(192.168.0.0/24) at 192.168.0.23:4000 of the remote server. so the remote server can access it through 192.168.0.23:4000

```python
ssh -L 4002:192.168.0.23:4000 user1@42.45.233.12
```

now localhost:4002 in the client app is equivalent to 192.168.0.23:4000 on a remote server.

## Remote Port Forwarding

It is the reverse of local port forwarding. Let`s say you want to give a client or someone a sneak peek of your application. you can obviously host this application to the remote server and do this. But you can do it easily by redirecting the remote server traffic to your local machine using the Remote Port Forwarding feature of ssh. Command for remote port forwarding,

```python
ssh -R <server-port>:<local-ip-address>:<local-port> username@server_ip/domain
```

Let`s say the application is running on localhost:3000 on your machine, server public IP address 45.67.24.42. you want to redirect the user to your local machine on 3000 port when someone enters 45.67.24.42:8080 on the browser.

```python
ssh -R 8080:localhost:3000 user1@42.67.24.42
```

if your application is running on a different machine(IP 192.168.0.2) of your local network,

```python
ssh -R 8080:192.168.0.2:3000 user1@42.67.24.42
```

Remembering the IP address and writing those large commands every time is a bit hassling.
So to resolve that, the client can write configs on `~/.ssh/config` file

## Config file format

```python
Host <domain-name>
HostName <IP Address>
Port <ssh-port>
User <username>
IdentityFile <private key path>
LocalForward <Client Port> <Server-local-Ip>:<Server Port>
RemoteForward <Server Port> <Client-IP>:<Client Port>
```

Example:

```python
Host ec2-workstation
HostName 45.224.22.12
Port 22
User ec2-user
IdentityFile ~/.ssh/id_rsa
LocalForward 3001 localhost:3000
LocalForward 4000 localhost:4000
RemoteForward 8080 localhost:3040
```

`ssh ec2-workstation` command will enable local port forwarding 3001 to sever's localhost 3000 and 4000 to server's localhost 4000. Also accessing 45.224.22.12:8080 will get forwarded to the client's localhost:3040.

Here it is good to define the private key if you have multiple private keys on your machine. If you do not define the private keys the ssh-client will brute force all the keys and some servers may block the client after too many retries.

## Good Practices

- disable password login(open /etc/ssh/sshd_config and set `PasswordAuthentication no`)
- add the passphrase to the keys (It is like a password for using the keys, Even if someone gets access to the private key they will not able to ssh into the remote server without knowing the passphrase)
- Change default ssh port (most of the time attacker Bruteforce tries to find the server with opened ssh port)
- add a firewall to allow specific IP addresses only
- Use a bastion host

If you are on a local network you can ignore most of the best practices, but if you are exposing your computer to the public internet you should follow the best practices. Else if an attacker gets into your computer he/she may get access to the cloud server of your company and can steal the client data which can put you and your company into a lawsuit.
