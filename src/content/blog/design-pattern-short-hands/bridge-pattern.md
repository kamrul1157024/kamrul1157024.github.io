---
author: Kamrul
pubDatetime: 2021-04-12T15:00:00Z
title: Bridge Pattern - Design Pattern shorthands
postSlug: bridge-pattern-design-pattern-shorthands
featured: false
draft: false
tags:
  - design-pattern
ogImage: ""
description: ব্রিজ ডিজাইন প্যাটার্ন ব্যবহার করা হয় যখন আমাদের ২টা ডিফারেন্ট ইন্টারফেস এর যেকোনো কম্বিনেশন লাগে, এতে ক্লাস এক্সপ্লোশন এড়ানো যায়।
---

## Table of contents

## Bridge

ব্রিজ ডিজাইন প্যাটার্ন ব্যবহার করা হয় যখন আমাদের ২টা ডিরফারেন্ট ইন্টারফেস এর যেকোন কম্বিনেশন ব্যবহার করা হয়। যেমন ধরি আমাদের ওয়েবসাইটের হোম পেজে বই আর আর্টিস্ট এর
প্রোফাইল দুই ভাবে দেখাব একটা ডিটেইলড ভিও (একচুয়্যাল ভিও) আর আরেকটা থাম্বেনেল টাইপ শর্ট ভিও। এখন এই জন্য আমরা যেটা করতে পারতাম আর্টিস্ট এর জন্য এইভাবে ক্লাস বানাতে
পারতাম `ActualArtistView` and `ShortArtistView`.আবার বই এর জন্য সিমিলার ভাবে করতে পারি `ActualBookView` and `ShortBookView`.এইভাবে করলে
দেখা যাবে ক্লাস এক্সপ্লোশান হবে আমাদের এইখানে দুইা ক্লাস তাই ক্লাস এক্সপ্লোশন বুজা যাচ্ছে না. আবার ধরি আমরা নতুন টাইপ এরটা ভিও এড করতে চাই গ্রুপভিও, তাহলে আমাদের নতুন করে
বই আর আর্টিস্ট এর জন্য করতে হবে। এই ধরনের সমস্যা সমাধান এর জন্য Bridge প্যটার্ন আসছে। আমরা এইখানে যাস্ট দুই ডিফারেন্ট ভিও ক্রিয়েট করবে এপর রিসোর্স গুলাকে ভিওতে
ইনজেক্ট করে দিব। Resource একটা জেনেরিক ইন্টারফেস , যেটা Artist আর Book এর Adapter হিসেবে কাজ করবে।

<img src="https://raw.githubusercontent.com/kamrul1157024/Design-Patterns-Shorthand-Bengali/master/src/bridge/diagram.png"/>

নিচের কোডগুলা সেলফ এক্সপ্লেনেটরিঃ

আর্টিস্ট ক্লাস আর্টিস্ট এর ইনফোর্মেশন হোল্ড করেঃ

```java
public class Artist {
    private final String name ;
    private final String bio;
    private final String informationUrl;

    public Artist(String name,String bio,String informationUrl)
    {
        this.name=name;
        this.bio=bio;
        this.informationUrl=informationUrl;
    }

    public String getName() {
        return name;
    }

    public String getBio() {
        return bio;
    }

    public String getInformationUrl() {
        return informationUrl;
    }
}
```

বুক ক্লাস বই এর ইনফোরমেশান হোল্ড করেঃ

```java
public class Book {
    private final String name;
    private final String details;
    private final String bookUrl;

    public Book(String name,String details,String bookUrl)
    {
        this.name=name;
        this.details=details;
        this.bookUrl=bookUrl;
    }

    public String getName() {
        return name;
    }

    public String getDetails() {
        return details;
    }

    public String getBookUrl() {
        return bookUrl;
    }
}
```

জেনেরিক রিসোর্স্ট ইন্টারফেসঃ

```java
public interface IResource {
    String getTitle();
    String getSnippet();
    String getUrl();
}
```

```java
public class ArtistResource implements IResource{

    private final Artist artist;

    public ArtistResource(Artist artist)
    {
        this.artist=artist;
    }

    @Override
    public String getTitle() {
        return artist.getName();
    }

    @Override
    public String getSnippet() {
        return artist.getBio();
    }

    @Override
    public String getUrl() {
        return artist.getInformationUrl();
    }
}
```

```java
public class BookResource implements IResource{

    private final Book book;

    public BookResource(Book book)
    {
        this.book=book;
    }

    @Override
    public String getTitle() {
        return book.getName();
    }

    @Override
    public String getSnippet() {
        return book.getDetails();
    }

    @Override
    public String getUrl() {
        return book.getBookUrl();
    }
}
```

জেনেরিক ভিও যেটা যাস্ট HTML কোড রিটার্ন করবে স্পেসিফিক ভিও এর জন্যঃ

```java
public interface IView {
    String showHTML();
}
```

```java
public class ActualView implements IView{

    private final IResource resource;

    public ActualView(IResource resource) {
        this.resource=resource;
    }

    @Override
    public String showHTML() {
        return "<a href="+resource.getUrl()+">\n<h1>\n"+resource.getTitle()+"\n</h1>\n</a>\n"
                + "<p>\n"+ resource.getSnippet()+"\n</p>\n";

    }
}
```

```java
public class ShortView implements IView{

    private final IResource resource;

    public ShortView(IResource resource) {
        this.resource=resource;
    }


    @Override
    public String showHTML() {
        return "<a href="+resource.getUrl()+">\n<h1>\n"+resource.getTitle()+"\n</h1>\n</a>\n" ;
    }
}
```

```java
public class BridgeMain {

    public static void main(String[] args) {

        //Creating Model

        Artist artist= new Artist(
                "Arnob",
                "Something about him",
                "https://demo.com/artist/arnob");

        Book book= new Book(
                "Gitanjali",
                "This book written by Rabindranath thakur",
                "https://demo.com/book/gitajali");


        IView bookShortView= new ShortView(new BookResource(book));
        IView bookActualView= new ActualView(new BookResource(book));

        System.out.println(bookShortView.showHTML());
        System.out.println(bookActualView.showHTML());


        IView artistShortView= new ActualView(new ArtistResource(artist));
        IView artistLongView= new ShortView(new ArtistResource(artist));

        System.out.println(artistShortView.showHTML());
        System.out.println(artistLongView.showHTML());
    }
}
```

```HTML
<a href=https://demo.com/book/gitajali>
<h1>
Gitanjali
</h1>
</a>

<a href=https://demo.com/book/gitajali>
<h1>
Gitanjali
</h1>
</a>
<p>
This book written by Rabindranath thakur
</p>

<a href=https://demo.com/artist/arnob>
<h1>
Arnob
</h1>
</a>
<p>
Something about him
</p>

<a href=https://demo.com/artist/arnob>
<h1>
Arnob
</h1>
</a>
```
