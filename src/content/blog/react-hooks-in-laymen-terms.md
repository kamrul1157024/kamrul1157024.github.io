---
author: Kamrul
pubDatetime: 2023-03-19T15:22:00Z
title: React Hooks In layman's terms
postSlug: React-Hooks-In-layman's-terms
featured: true
draft: false
tags:
  - React
  - Js
ogImage: ""
description: Even though React Hooks are simple I have found myself(in my early days) and codes where people use hooks in the wrong way due to the open nature of hooks
---

## Table of contents

## useState

It stores the application's state.

### What should it store?

The atomic unit of change. If you are updating two different states on a change you should store it in one single state.
Do not store derived states from a useState.

## useReducer

This is the same as useState, it also stores a state. The difference is how we update the state. useReducer going to give you a dispatch method where you will say what action you want to perform. Reducer going to do what is necessary. In useState you were responsible to modify the data to perform a certain action.

useState is an imperative way to deal with react state, whereas useReducer is a declarative way of doing this.

## useEffect

It is used for syncing the external State(server state, local store, DOM state, etc) with the application's internal state. You should not use it for syncing the internal state. If you run into this type of case, you should be better off lifting the state up and merging the states except for some very very rare cases.

### When does It gets fired?

update a application state → Component Re Renders → useEffect get fired

## useLayoutEffect

Same As useEffect, but it gets fired after DOM is painted. For example, you needed to do some calculations after your CSS is loaded

## useMemo and useCallback

useMemo and useCallback both are used for memoization-based Optimization. useMemo stores objects. useCallback is used for storing functions.

Here tradeoff is between CPU cycle and memory. Using useMemo and useCallback will reduce the CPU cycle reducing re-rendered at the cost of memory.
Keep in mind that you should not store simple stuff(array length) using useMemo.

```js
const length = useMemo(() => array.length, [array]);
```

Because checking if array changes and then calculating the array length has O(n) complexity. But direct calculation of array length is O(1) operation.

While using useEffect, useLayoutEffect, useCallback and useMemo do not left out any dependency or ignore `react-hooks/exhaustive-deps` rule unless you are very very sure about it. As it one of the cause of bugs on react app caused by closures scope. Add the dependency and handle the case inside the useEffect/useLayoutEffect.

## useRef

useRef is used for storing mutable values. If you need to store something which should not trigger re-render on the update you should store it using useRef.

A common use case, you want to get the Native DOM ref after React finishes its renders. You do not want to re-render just after completing the DOM render. You can observe on ref variable using useEffect and useState and perform some operations.

If you are using External Library, you can store the API provided by the external library on a Ref.

And last yes you can punch a hole in your react app data flow using ref. You can pass a ref from the parent component to the child component and store the child component state mutation functions on a Ref. Then use them in the parent component to mutate the child component state. But sooner or later you are going to rip your hair off and lift the state up to the parent component due to bugs and state sync issues. So why lose hair if you can just lift the state up early?

## useCustomHook

A custom hook is a function that contains react hooks. We use `use` as a prefix so that ESLint can treat this function as hooks apply "rules of the hook" on it.

Always follow [rules of hooks](https://legacy.reactjs.org/docs/hooks-rules.html), and configure [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) on your React app.
