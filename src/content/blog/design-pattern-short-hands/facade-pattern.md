---
author: Kamrul
pubDatetime: 2021-04-12T11:00:00Z
title: Facade Pattern - Design Pattern shorthands
postSlug: facade-pattern-design-pattern-shorthands
featured: false
draft: false
tags:
  - design-pattern
ogImage: ""
description: হাইলি Decoupled সিস্টেমের অবজেক্ট গুলার মধ্যে কমপ্লেক্স wiring থাকতে পারে, ক্লায়েন্ট কে সেই কমপ্লেক্সিটি থেকে বাঁচানোর জন্য হায়ার লেভেল ইন্টারফেস বানানো হয় যেটা ফাসাড।
---

## Table of contents

## Facade

SOLID এর Single Responsibility Principle ফলো করলে সিস্টেম হাইলি
Decoupled হয়ে যাবে যেটা ভাল কিন্তু হাইলি Decoupled সিস্টেমের অব্জেক্ট গুলার মধ্যে
কমপ্লেক্স wiring থাকতে পারে ইভেন সাইক্লেকিক ডিপেডেন্সি থাকতে পারে তাই Client(
user of the code) কে এই কম্পলেক্স ডিপেডেন্সি হ্যান্ডেলিং থেকে বাচানোর জন্য একটা হায়ার লেভেল
ইন্টারফেস বানানো হয় যেটা ফাসাড। ফাসাড নিজে এই অবজেক্ট এর ডিপেডেন্সি হ্যান্ডেল করে
ক্লায়েন্ট কে অবজেক্ট রিটার্ন করে ।
একটা হোম থিয়েতার এর কথা ভাবা যেতে পারে, হোমথিয়েটার অবেজেক্ট বানানোর জন্য
ডিভিডি টিভি সাউন্ডবক্স লাগতে পারে । রেফারেন্স -> Head First to design Pattern

জাভার Spring এর IOC Container একটা ফাসাড , যেটা একটা অবজেক্ট
পুল মেনটেইন করে `@Autowired` ব্যাবহার করলে Java Reflection API এর
মাধ্যমে ক্লাসগুলার মধ্যে ডিপেডেন্সি ইঞ্জেকশন করে দেয়।

আবার Principle Of least Knowledge বলে ক্লাস গুলা শুধু মাত্র নিজের মেথড
বা তার ফ্রেন্ড এর মেথড কল করতে পারবে কিন্তু ফ্রেন্ড এর ফ্রেন্ড এর মেথড কল করতে
পারবে না।

```
A a=new A()
a.someMthod() (Ok)
a.b.someMethod() (Ok)
a.b.c.someMethod() (এইটা করা উচিত না )
```

যদি এই প্রিন্সিপল ফলো না করা হয় তাহলে ক্লাস গুলার মধ্যে অনেক ডিপ ডিপেডেন্সি চলে
আসতে পারে । এর নতুন কেউ আসলে তার সিস্টেম বুজতে অসুবিধা হবে। আবার চেঞ্জ
করতেও ঝামেলা হবে ।
