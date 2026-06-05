# Database Model

## Project Name

Social Community Maker

## Overview

This document describes the initial database model for the MVP version of Social Community Maker.

The MVP database supports:

- User accounts
- Authentication
- Communities
- Community membership
- Posts
- Comments
- Likes
- Basic community ownership and moderation

The database will use PostgreSQL.

---

# Entity Relationship Summary

```text
User
 ├── owns many Communities
 ├── belongs to many Communities through CommunityMember
 ├── creates many Posts
 ├── creates many Comments
 └── creates many PostLikes

Community
 ├── belongs to one owner User
 ├── has many CommunityMembers
 ├── has many Posts
 └── has many Comments through Posts

CommunityMember
 ├── belongs to one User
 └── belongs to one Community

Post
 ├── belongs to one Community
 ├── belongs to one User as author
 ├── has many Comments
 └── has many PostLikes

Comment
 ├── belongs to one Post
 └── belongs to one User as author

PostLike
 ├── belongs to one Post
 └── belongs to one User
