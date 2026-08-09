---
author: Kamrul
pubDatetime: 2021-04-12T10:00:00Z
title: Adapter Pattern - Design Pattern shorthands
postSlug: adapter-pattern-design-pattern-shorthands
featured: false
draft: false
tags:
  - design-pattern
ogImage: ""
description: Adapter আর Decorator ডিজাইন প্যাটার্ন এর মধ্যে পার্থক্য হল, ডেকোরেটোর বিহেভিয়ার পরিবর্তন করে কিন্ত Adapter পুরাতন ইমপ্লিমেন্টেড লজিকেই ব্যবহার করে।
---

## Table of contents

## Adapter

Adapter আর Decorator ডিজাইন প্যাটার্ন এর মধ্যে পার্থক্য হল , ডেকোরেটোর বিহেভিয়ার
পরিবর্তন করে কিন্ত Adapter পুরাতন ইমপ্লিমেন্টেড লজিকেই ব্যবহার করে।যেমন নরমাল ইলেক্ট্রিক্যাল
এডাপ্টার এর এনালজি কথা ধরা যেতে পারে,এডাপ্টার শুধু মাত্র সকেট এর পিন এর ধরন পরিবর্তন করছে
কিন্তু এডাপটার যদি ভোল্টেজ এর পরিবর্তন করে তাহলে সেটা এডাপ্টার থাকবে না, হয়ে যাবে
ডেকোরেটর ।

`Adaptee` হল সেই ক্লাস যাকে `Adapter` এডাপ্ট করবে।

```java
ITarget target= new Adapter(new Adaptee())
target.request()
```

```java
public interface ITarget{
    void request();
}
```

```java
public class Adapter implements ITarget{

    private Adaptee adaptee;

    public Adapter(Adaptee adaptee)
    {
        this.adaptee= adaptee;
    }

    public void request()
    {
           ...our custom logic to call
           from Adaptee Class ....

           Example :
           adaptee.simpleRequest();
    }

}
```

```java
public class Adaptee{
    public void simpleRequest()
    {
        ...Some Logic...
    }
}
```
