# Database Model

This document describes the MVP database model for Social Community Maker.

The project currently uses H2 for local development and is structured to support PostgreSQL later.

## Entities

### User

Represents an application user who can register, log in, create communities, join communities, create posts, comment, and like posts.

Table:

```text
users
```

Main fields:

```text
id
email
username
display_name
password_hash
bio
avatar_url
created_at
updated_at
```

Constraints:

```text
email unique
username unique
email required
username required
display_name required
password_hash required
```

Relationships:

```text
User owns many communities
User can be a member of many communities
User can create many posts
User can create many comments
User can like many posts
```

---

### Community

Represents a social community created by a user.

Table:

```text
communities
```

Main fields:

```text
id
name
slug
description
visibility
owner_id
created_at
updated_at
```

Visibility values:

```text
PUBLIC
PRIVATE
INVITE_ONLY
```

Constraints:

```text
slug unique
name required
slug required
visibility required
owner_id required
```

Relationships:

```text
Community belongs to one owner User
Community has many members through CommunityMember
Community has many posts
```

---

### CommunityMember

Represents membership between a user and a community.

Table:

```text
community_members
```

Main fields:

```text
id
community_id
user_id
role
joined_at
```

Role values:

```text
OWNER
ADMIN
MEMBER
```

Constraints:

```text
community_id required
user_id required
role required
unique community_id + user_id
```

Relationships:

```text
CommunityMember belongs to one Community
CommunityMember belongs to one User
```

Notes:

```text
When a user creates a community, an OWNER membership record is automatically created.
Users can join public communities as MEMBER.
Community owners cannot leave their own community.
Duplicate membership records are prevented by application logic and a database unique constraint.
```

---

### Post

Represents a post created inside a community.

Table:

```text
posts
```

Main fields:

```text
id
community_id
author_id
content
created_at
updated_at
deleted_at
```

Constraints:

```text
community_id required
author_id required
content required
```

Relationships:

```text
Post belongs to one Community
Post belongs to one author User
Post has many comments
Post has many likes
```

Notes:

```text
Posts use soft delete through deleted_at.
Only community members or owners can create posts.
Post authors and community owners can delete posts.
```

---

### Comment

Represents a comment on a post.

Table:

```text
comments
```

Main fields:

```text
id
post_id
author_id
content
created_at
updated_at
deleted_at
```

Constraints:

```text
post_id required
author_id required
content required
```

Relationships:

```text
Comment belongs to one Post
Comment belongs to one author User
```

Notes:

```text
Comments use soft delete through deleted_at.
Only community members can comment.
Comment authors and community owners can delete comments.
```

---

### PostLike

Represents a user like on a post.

Table:

```text
post_likes
```

Main fields:

```text
id
post_id
user_id
created_at
```

Constraints:

```text
post_id required
user_id required
unique post_id + user_id
```

Relationships:

```text
PostLike belongs to one Post
PostLike belongs to one User
```

Notes:

```text
A user can like a post only once.
Users can unlike posts.
Only community members can like posts.
```

---

## Relationship Summary

```text
User 1 -> many Communities as owner
User 1 -> many CommunityMember records
Community 1 -> many CommunityMember records
Community 1 -> many Posts
User 1 -> many Posts as author
Post 1 -> many Comments
User 1 -> many Comments as author
Post 1 -> many PostLike records
User 1 -> many PostLike records
```

## Simplified ERD

```text
users
  id PK
  email UNIQUE
  username UNIQUE
  password_hash

communities
  id PK
  owner_id FK -> users.id
  slug UNIQUE

community_members
  id PK
  community_id FK -> communities.id
  user_id FK -> users.id
  role
  UNIQUE community_id + user_id

posts
  id PK
  community_id FK -> communities.id
  author_id FK -> users.id

comments
  id PK
  post_id FK -> posts.id
  author_id FK -> users.id

post_likes
  id PK
  post_id FK -> posts.id
  user_id FK -> users.id
  UNIQUE post_id + user_id
```

## Current MVP Rules

```text
Users can register and log in.
Users can create communities.
Community creators automatically become OWNER members.
Users can join public communities.
Users can leave joined communities.
Community owners cannot leave their own communities.
Only community members can create posts.
Only community members can comment.
Only community members can like posts.
Post authors and community owners can delete posts.
Comment authors and community owners can delete comments.
Duplicate community memberships are prevented.
Duplicate post likes are prevented.
```

## Future Model Improvements

Possible future database improvements:

```text
Add user profile fields
Add community images or banners
Add post titles or media attachments
Add notifications
Add comment replies
Add moderation actions
Add community invitations
Add pagination indexes
Add PostgreSQL migrations with Flyway or Liquibase
```
