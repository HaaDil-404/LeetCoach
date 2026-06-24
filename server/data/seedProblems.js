const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env from the server root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Problem = require("../models/Problem");
const connectDB = require("../config/db");

const problems = [
  // ===================== EASY (20) =====================
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists.",
    ],
    leetcodeLink: "https://leetcode.com/problems/two-sum/",
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
    examples: [
      { input: 's = "()"', output: "true", explanation: "" },
      { input: 's = "()[]{}"', output: "true", explanation: "" },
      { input: 's = "(]"', output: "false", explanation: "" },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    leetcodeLink: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    description:
      "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "",
      },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
    ],
    leetcodeLink: "https://leetcode.com/problems/merge-two-sorted-lists/",
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Array",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.",
      },
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    leetcodeLink:
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    topic: "Two Pointers",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation:
          '"amanaplanacanalpanama" is a palindrome.',
      },
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters.",
    ],
    leetcodeLink: "https://leetcode.com/problems/valid-palindrome/",
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    topic: "Binary Tree",
    description:
      "Given the root of a binary tree, invert the tree, and return its root.",
    examples: [
      {
        input: "root = [4,2,7,1,3,6,9]",
        output: "[4,7,2,9,6,3,1]",
        explanation: "",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100",
    ],
    leetcodeLink: "https://leetcode.com/problems/invert-binary-tree/",
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "Hash Table",
    description:
      "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters.",
    ],
    leetcodeLink: "https://leetcode.com/problems/valid-anagram/",
  },
  {
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "All integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    leetcodeLink: "https://leetcode.com/problems/binary-search/",
  },
  {
    title: "Linked List Cycle",
    difficulty: "Easy",
    topic: "Linked List",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.",
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation:
          "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
      },
    ],
    constraints: [
      "The number of nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5",
    ],
    leetcodeLink: "https://leetcode.com/problems/linked-list-cycle/",
  },
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Binary Tree",
    description:
      "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3",
        explanation: "",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  },
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Array",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true", explanation: "" },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
    ],
    leetcodeLink: "https://leetcode.com/problems/contains-duplicate/",
  },
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "",
      },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    leetcodeLink: "https://leetcode.com/problems/reverse-linked-list/",
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      {
        input: "n = 3",
        output: "3",
        explanation:
          "There are three ways to climb to the top: 1+1+1, 1+2, 2+1.",
      },
    ],
    constraints: ["1 <= n <= 45"],
    leetcodeLink: "https://leetcode.com/problems/climbing-stairs/",
  },
  {
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    topic: "Binary Tree",
    description:
      "Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "true",
        explanation: "",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 5000].",
      "-10^4 <= Node.val <= 10^4",
    ],
    leetcodeLink: "https://leetcode.com/problems/balanced-binary-tree/",
  },
  {
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    topic: "Stack",
    description:
      "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).",
    examples: [
      {
        input:
          '["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]',
        output: "[null, null, null, 1, 1, false]",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= x <= 9",
      "At most 100 calls will be made to push, pop, peek, and empty.",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/implement-queue-using-stacks/",
  },
  {
    title: "Roman to Integer",
    difficulty: "Easy",
    topic: "Math",
    description:
      "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.",
    examples: [
      {
        input: 's = "MCMXCIV"',
        output: "1994",
        explanation: "M = 1000, CM = 900, XC = 90 and IV = 4.",
      },
    ],
    constraints: [
      "1 <= s.length <= 15",
      "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').",
    ],
    leetcodeLink: "https://leetcode.com/problems/roman-to-integer/",
  },
  {
    title: "Single Number",
    difficulty: "Easy",
    topic: "Bit Manipulation",
    description:
      "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    examples: [
      { input: "nums = [4,1,2,1,2]", output: "4", explanation: "" },
    ],
    constraints: [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4",
    ],
    leetcodeLink: "https://leetcode.com/problems/single-number/",
  },
  {
    title: "Missing Number",
    difficulty: "Easy",
    topic: "Array",
    description:
      "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    examples: [
      {
        input: "nums = [3,0,1]",
        output: "2",
        explanation:
          "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number.",
      },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 10^4",
      "All the numbers of nums are unique.",
    ],
    leetcodeLink: "https://leetcode.com/problems/missing-number/",
  },
  {
    title: "Palindrome Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    description:
      "Given the head of a singly linked list, return true if it is a palindrome or false otherwise.",
    examples: [
      { input: "head = [1,2,2,1]", output: "true", explanation: "" },
    ],
    constraints: [
      "The number of nodes in the list is in the range [1, 10^5].",
      "0 <= Node.val <= 9",
    ],
    leetcodeLink: "https://leetcode.com/problems/palindrome-linked-list/",
  },
  {
    title: "Move Zeroes",
    difficulty: "Easy",
    topic: "Two Pointers",
    description:
      "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.",
    examples: [
      {
        input: "nums = [0,1,0,3,12]",
        output: "[1,3,12,0,0]",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-2^31 <= nums[i] <= 2^31 - 1",
    ],
    leetcodeLink: "https://leetcode.com/problems/move-zeroes/",
  },

  // ===================== MEDIUM (20) =====================
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation:
          'The answer is "abc", with the length of 3.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    topic: "Two Pointers",
    description:
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "",
      },
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    leetcodeLink: "https://leetcode.com/problems/3sum/",
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    topic: "Two Pointers",
    description:
      "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "",
      },
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/container-with-most-water/",
  },
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    topic: "Hash Table",
    description:
      "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "",
      },
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters.",
    ],
    leetcodeLink: "https://leetcode.com/problems/group-anagrams/",
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters.",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/longest-palindromic-substring/",
  },
  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Array",
    description:
      "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.",
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation: "",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topic: "Heap",
    description:
      "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    examples: [
      {
        input: "nums = [1,1,1,2,2,3], k = 2",
        output: "[1,2]",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array].",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/top-k-frequent-elements/",
  },
  {
    title: "Encode and Decode Strings",
    difficulty: "Medium",
    topic: "String",
    description:
      "Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.",
    examples: [
      {
        input: '["lint","code","love","you"]',
        output: '["lint","code","love","you"]',
        explanation: "One possible encode method: 4#lint4#code4#love3#you",
      },
    ],
    constraints: [
      "0 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/encode-and-decode-strings/",
  },
  {
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    topic: "Hash Table",
    description:
      "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    examples: [
      {
        input: "nums = [100,4,200,1,3,2]",
        output: "4",
        explanation:
          "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.",
      },
    ],
    constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    leetcodeLink:
      "https://leetcode.com/problems/longest-consecutive-sequence/",
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topic: "Binary Tree",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        explanation: "",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    topic: "Binary Tree",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    examples: [
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation:
          "The root node's value is 5 but its right child's value is 4.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-2^31 <= Node.val <= 2^31 - 1",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/validate-binary-search-tree/",
  },
  {
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    topic: "Binary Tree",
    description:
      "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    examples: [
      {
        input: "root = [3,1,4,null,2], k = 1",
        output: "1",
        explanation: "",
      },
    ],
    constraints: [
      "The number of nodes in the tree is n.",
      "1 <= k <= n <= 10^4",
      "0 <= Node.val <= 10^4",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    topic: "Graph",
    description:
      "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
    ],
    leetcodeLink: "https://leetcode.com/problems/course-schedule/",
  },
  {
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graph",
    description:
      "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      {
        input:
          'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
        explanation: "",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
    ],
    leetcodeLink: "https://leetcode.com/problems/number-of-islands/",
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    examples: [
      {
        input: "coins = [1,5,11], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1",
      },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    leetcodeLink: "https://leetcode.com/problems/coin-change/",
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected, so if two adjacent houses were broken into on the same night, the police will be contacted. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "4",
        explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3).",
      },
    ],
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400",
    ],
    leetcodeLink: "https://leetcode.com/problems/house-robber/",
  },
  {
    title: "Rotate Image",
    difficulty: "Medium",
    topic: "Matrix",
    description:
      "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.",
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]",
        explanation: "",
      },
    ],
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20",
      "-1000 <= matrix[i][j] <= 1000",
    ],
    leetcodeLink: "https://leetcode.com/problems/rotate-image/",
  },
  {
    title: "Word Search",
    difficulty: "Medium",
    topic: "Backtracking",
    description:
      "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    examples: [
      {
        input:
          'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: "true",
        explanation: "",
      },
    ],
    constraints: [
      "m == board.length",
      "n == board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
    ],
    leetcodeLink: "https://leetcode.com/problems/word-search/",
  },
  {
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    topic: "Backtracking",
    description:
      "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.",
    examples: [
      {
        input: 'digits = "23"',
        output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
        explanation: "",
      },
    ],
    constraints: [
      "0 <= digits.length <= 4",
      "digits[i] is a digit in the range ['2', '9'].",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
  },
  {
    title: "Subsets",
    difficulty: "Medium",
    topic: "Backtracking",
    description:
      "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10",
      "-10 <= nums[i] <= 10",
      "All the numbers of nums are unique.",
    ],
    leetcodeLink: "https://leetcode.com/problems/subsets/",
  },

  // ===================== HARD (20) =====================
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topic: "Binary Search",
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2.",
      },
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  },
  {
    title: "Regular Expression Matching",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description:
      "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' Matches any single character and '*' Matches zero or more of the preceding element. The matching should cover the entire input string (not partial).",
    examples: [
      {
        input: 's = "aa", p = "a*"',
        output: "true",
        explanation:
          "'*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes 'aa'.",
      },
    ],
    constraints: [
      "1 <= s.length <= 20",
      "1 <= p.length <= 20",
      "s contains only lowercase English letters.",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/regular-expression-matching/",
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    topic: "Linked List",
    description:
      "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "",
      },
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
    ],
    leetcodeLink: "https://leetcode.com/problems/merge-k-sorted-lists/",
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topic: "Two Pointers",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "",
      },
    ],
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    leetcodeLink: "https://leetcode.com/problems/trapping-rain-water/",
  },
  {
    title: "N-Queens",
    difficulty: "Hard",
    topic: "Backtracking",
    description:
      "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
    examples: [
      {
        input: "n = 4",
        output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
        explanation: "",
      },
    ],
    constraints: ["1 <= n <= 9"],
    leetcodeLink: "https://leetcode.com/problems/n-queens/",
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Hard",
    topic: "Sliding Window",
    description:
      "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: "",
      },
    ],
    constraints: [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/minimum-window-substring/",
  },
  {
    title: "Word Ladder",
    difficulty: "Hard",
    topic: "Graph",
    description:
      "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter. Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord.",
    examples: [
      {
        input:
          'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: "5",
        explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.',
      },
    ],
    constraints: [
      "1 <= beginWord.length <= 10",
      "endWord.length == beginWord.length",
      "1 <= wordList.length <= 5000",
    ],
    leetcodeLink: "https://leetcode.com/problems/word-ladder/",
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    topic: "Binary Tree",
    description:
      "Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.",
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
        explanation: "",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-1000 <= Node.val <= 1000",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
  },
  {
    title: "Longest Increasing Path in a Matrix",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description:
      "Given an m x n integers matrix, return the length of the longest increasing path in matrix. From each cell, you can either move in four directions: left, right, up, or down. You may not move diagonally or move outside of the boundary.",
    examples: [
      {
        input: "matrix = [[9,9,4],[6,6,8],[2,1,1]]",
        output: "4",
        explanation: "The longest increasing path is [1, 2, 6, 9].",
      },
    ],
    constraints: [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 200",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
  },
  {
    title: "Alien Dictionary",
    difficulty: "Hard",
    topic: "Graph",
    description:
      "There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you. You are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this new language. Derive the order of letters in this language.",
    examples: [
      {
        input: 'words = ["wrt","wrf","er","ett","rftt"]',
        output: '"wertf"',
        explanation: "",
      },
    ],
    constraints: [
      "1 <= words.length <= 100",
      "1 <= words[i].length <= 100",
      "words[i] consists of only lowercase English letters.",
    ],
    leetcodeLink: "https://leetcode.com/problems/alien-dictionary/",
  },
  {
    title: "Basic Calculator",
    difficulty: "Hard",
    topic: "Stack",
    description:
      "Given a string s representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation. Note: You are not allowed to use any built-in function which evaluates strings as mathematical expressions.",
    examples: [
      {
        input: 's = "(1+(4+5+2)-3)+(6+8)"',
        output: "23",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= s.length <= 3 * 10^5",
      "s consists of digits, '+', '-', '(', ')', and ' '.",
    ],
    leetcodeLink: "https://leetcode.com/problems/basic-calculator/",
  },
  {
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    topic: "Heap",
    description:
      "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class.",
    examples: [
      {
        input:
          '["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\n[[], [1], [2], [], [3], []]',
        output: "[null, null, null, 1.5, null, 2.0]",
        explanation: "",
      },
    ],
    constraints: [
      "-10^5 <= num <= 10^5",
      "There will be at least one element in the data structure before calling findMedian.",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/find-median-from-data-stream/",
  },
  {
    title: "Word Search II",
    difficulty: "Hard",
    topic: "Trie",
    description:
      "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.",
    examples: [
      {
        input:
          'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
        output: '["eat","oath"]',
        explanation: "",
      },
    ],
    constraints: [
      "m == board.length",
      "n == board[i].length",
      "1 <= m, n <= 12",
      "1 <= words.length <= 3 * 10^4",
    ],
    leetcodeLink: "https://leetcode.com/problems/word-search-ii/",
  },
  {
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    topic: "Sliding Window",
    description:
      "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
    examples: [
      {
        input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
        output: "[3,3,5,5,6,7]",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "1 <= k <= nums.length",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/sliding-window-maximum/",
  },
  {
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    topic: "Stack",
    description:
      "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    examples: [
      {
        input: "heights = [2,1,5,6,2,3]",
        output: "10",
        explanation: "",
      },
    ],
    constraints: [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/largest-rectangle-in-histogram/",
  },
  {
    title: "Edit Distance",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description:
      "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character.",
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3",
        explanation:
          "horse -> rorse (replace 'h' with 'r'), rorse -> rose (remove 'r'), rose -> ros (remove 'e').",
      },
    ],
    constraints: [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters.",
    ],
    leetcodeLink: "https://leetcode.com/problems/edit-distance/",
  },
  {
    title: "Critical Connections in a Network",
    difficulty: "Hard",
    topic: "Graph",
    description:
      "There are n servers numbered from 0 to n - 1 connected by undirected server-to-server connections forming a network where connections[i] = [ai, bi] represents a connection between servers ai and bi. Any server can reach other servers directly or indirectly through the network. A critical connection is a connection that, if removed, will make some servers unable to reach some other server. Return all critical connections in the network in any order.",
    examples: [
      {
        input: "n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]",
        output: "[[1,3]]",
        explanation: "",
      },
    ],
    constraints: [
      "2 <= n <= 10^5",
      "n - 1 <= connections.length <= 10^5",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/critical-connections-in-a-network/",
  },
  {
    title: "Burst Balloons",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    description:
      "You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it represented by an array nums. You are asked to burst all the balloons. If you burst the ith balloon, you will get nums[i - 1] * nums[i] * nums[i + 1] coins. If i - 1 or i + 1 goes out of bounds of the array, then treat it as if there is a balloon with a 1 painted on it. Return the maximum coins you can collect by bursting the balloons wisely.",
    examples: [
      {
        input: "nums = [3,1,5,8]",
        output: "167",
        explanation:
          "nums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []\ncoin = 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 167",
      },
    ],
    constraints: ["n == nums.length", "1 <= n <= 300", "0 <= nums[i] <= 100"],
    leetcodeLink: "https://leetcode.com/problems/burst-balloons/",
  },
  {
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    topic: "Stack",
    description:
      "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
    examples: [
      {
        input: 's = "(()"',
        output: "2",
        explanation:
          'The longest valid parentheses substring is "()".',
      },
    ],
    constraints: ["0 <= s.length <= 3 * 10^4", "s[i] is '(' or ')'."],
    leetcodeLink:
      "https://leetcode.com/problems/longest-valid-parentheses/",
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    topic: "Binary Tree",
    description:
      "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. The path sum of a path is the sum of the node's values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.",
    examples: [
      {
        input: "root = [-10,9,20,null,null,15,7]",
        output: "42",
        explanation:
          "The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 3 * 10^4].",
      "-1000 <= Node.val <= 1000",
    ],
    leetcodeLink:
      "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("\n🌱 Starting database seed...");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("   Cleared existing problems.");

    // Insert all problems
    const inserted = await Problem.insertMany(problems);
    console.log(`   ✅ Inserted ${inserted.length} problems.`);

    const easy = inserted.filter((p) => p.difficulty === "Easy").length;
    const medium = inserted.filter((p) => p.difficulty === "Medium").length;
    const hard = inserted.filter((p) => p.difficulty === "Hard").length;

    console.log(`\n   📊 Breakdown:`);
    console.log(`      Easy:   ${easy}`);
    console.log(`      Medium: ${medium}`);
    console.log(`      Hard:   ${hard}`);
    console.log(`\n🎉 Seed complete!\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
