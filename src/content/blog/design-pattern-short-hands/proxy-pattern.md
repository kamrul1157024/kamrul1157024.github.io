---
author: Kamrul
pubDatetime: 2021-04-12T12:00:00Z
title: Proxy Pattern - Design Pattern shorthands
postSlug: proxy-pattern-design-pattern-shorthands
featured: false
draft: false
tags:
  - design-pattern
ogImage: ""
description: অবজেক্ট ক্রিয়েশন এর সময় হেভি কম্পিউটেশন বা I/O করলে ক্লাসকে লেজি করার জন্য প্রক্সি প্যাটার্ন ব্যবহার করা হয়, ক্লাস মডিফাই না করেই।
---

## Table of contents

## Proxy

যদি কোন ক্লাস আগে থেকে লিখা থাকে বা অবজেক্ট ক্রিয়েশন এর সময় হেভি কম্পিটেশন বা
I/O(Network Call / Database / File-r/w ) করে তখন যদি কোন কারনে
বা Open-Close principal এর জন্য ক্লাসকে মোডিফিকেশন না করা যায় তাহলে
ক্লাসকে লেজি করার জন্য তখন আমরা প্রক্সি প্যটার্ন ব্যবহার করে ক্লাসের বেহেভিয়ার
পরিবর্তন করে লেজি করতে পারি, উল্লেখ্য যে Decorator প্যটার্ন ও ক্লাসের বিহেভিয়ার
পরিবর্তন করে কিন্তু ডেকোরেটোর প্যটার্ন ক্লাস এর কন্টেন্ট ও লজিক মডিফাই করে আর
প্রক্সি শুধুমাত্র ক্লাসের বিহেভিয়ার লেজি করে। আর Adapter প্যটার্ন ক্লাসের কোন প্রকার
বিভেবিয়ার পরিবর্তন করে না শুধু মাত্র ইন্টারফেস(ফাংশনের প্যারামিট্যার এর অর্ডার/মেথড নেম
/বা ক্লাস কল করার আগে কোন ইন্টার্নাল লজিক এপ্লাই করা লাগলে)
চেঞ্জ করে।

এক্সাম্পল হিসেবে ধরা যাক একটা ক্লাস আছে যেটা নেটওয়ার্ক থেকে বই ফেচ করে, তারপর বইটার
ডিটেইলস ইনফোরমেশন দিয়ে দেয় ।
<img src="https://raw.githubusercontent.com/kamrul1157024/Design-Patterns-Shorthand-Bengali/master/src/proxy/diagram.png"/>

```java
public interface IBookParser {
    String getDescriptionInJSON();
}
```

```java
public class BookParser implements IBookParser{

    private String descriptionJSON;

    public BookParser(String url)
    {
        descriptionJSON=fetch(url);
    }

    @Override
    public String getDescriptionInJSON() {
        return descriptionJSON;
    }

    String fetch(String url)
    {
       ....Some Logic....
        (মেইন কোডে লজিক লিখা আছে)
    }
}
```

এইখানেই আমরা লেজি করছি অবজেক্ট যখন `getDescriptionInJSON()` কল করা হচ্ছে
তখন ক্রিয়েট করছি

```java

public class BookParserProxy implements IBookParser{

    private BookParser bookParser=null;
    private String url;
    public BookParserProxy(String url)
    {
        this.url=url;
    }
    @Override
    public String getDescriptionInJSON() {
        if (bookParser==null) bookParser=new BookParser(this.url);
        return bookParser.getDescriptionInJSON();
    }
}
```

```java
public class ProxyMain {
    public static void main(String[] args) {
        String url="https://openlibrary.org/works/OL45883W.json";

        BookParserProxy bookParserProxy=new BookParserProxy(url);
        System.out.println("Object Created!");
        System.out.println(bookParserProxy.getDescriptionInJSON());
    }
}
```

```
Object Created!(সাথে সাথে চলে আসবে কারন কোন নেটওয়ার্ক কল হবে না !)
{"description": "The main character of Fantastic Mr. Fox is an extremely clever anthropomorphized fox named Mr. Fox. He lives with his wife and four little foxes. In order to feed his family, he steals food from the cruel, brutish farmers named Boggis, Bunce, and Bean every night.\r\n\r\nFinally tired of being constantly outwitted by Mr. Fox, the farmers attempt to capture and kill him. The foxes escape in time by burrowing deep into the ground. The farmers decide to wait outside the hole for the foxes to emerge. Unable to leave the hole and steal food, Mr. Fox and his family begin to starve. Mr. Fox devises a plan to steal food from the farmers by tunneling into the ground and borrowing into the farmer's houses.\r\n\r\nAided by a friendly Badger, the animals bring the stolen food back and Mrs. Fox prepares a great celebratory banquet attended by the other starving animals and their families. Mr. Fox invites all the animals to live with him underground and says that he will provide food for them daily thanks to his underground passages. All the animals live happily and safely, while the farmers remain waiting outside in vain for Mr. Fox to show up.", "title": "Fantastic Mr. Fox", "covers": [6498519, 8904777, 108274, 233884, 1119236, -1, 10222599, 10482837, 3216657], "subject_places": ["English countryside"], "subjects": ["Animals", "Hunger", "Open Library Staff Picks", "Juvenile fiction", "Children's stories, English", "Foxes", "Fiction", "Zorros", "Ficci\u00f3n juvenil", "Tunnels", "Interviews", "Farmers", "Children's stories", "Rats", "Welsh Authors", "English Authors", "Thieves", "Tricksters", "Badgers", "Children's fiction", "Foxes, fiction", "Underground"], "subject_people": ["Bean", "Boggis", "Bunce", "Mr Fox"], "key": "/works/OL45883W", "authors": [{"author": {"key": "/authors/OL34184A"}, "type": {"key": "/type/author_role"}}], "subject_times": ["20th Century"], "type": {"key": "/type/work"}, "latest_revision": 43, "revision": 43, "created": {"type": "/type/datetime", "value": "2009-10-15T11:34:21.437031"}, "last_modified": {"type": "/type/datetime", "value": "2021-02-05T12:52:33.907834"}}
```

এইখানে একটা সিম্পন এক্সামপল লেজি করে দেখানো হল,আরো কমপ্লেক্স কেস এর জন্য এইভাবে করা যাবে সেখানে হয়ত শুধু মাত্র অবজেক্ট ক্রিয়েশন লেজি করলে
হবে না সেটা নির্ভর করবে যে ক্লাস লেজি করছি তার উপর।
