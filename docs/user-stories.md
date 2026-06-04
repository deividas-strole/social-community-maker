# User Stories

## Project: Social Community Maker

Social Community Maker is a full-stack SaaS-style platform that allows users to create, customize, and manage their own online social communities.

## User Roles

- Guest Visitor
- Registered User
- Community Member
- Community Owner
- Community Admin
- Platform Admin

---

# MVP User Stories

## Authentication

### Register Account

As a guest visitor,  
I want to create an account,  
so that I can create or join social communities.

Acceptance Criteria:

- User can register with name, email, username, and password.
- Email must be unique.
- Username must be unique.
- Password must meet minimum security requirements.
- After registration, the user can log in.

---

### Login

As a registered user,  
I want to log in,  
so that I can access my dashboard and communities.

Acceptance Criteria:

- User can log in with email and password.
- Invalid credentials show an error message.
- Successful login returns an authentication token.
- Logged-in user is redirected to the dashboard.

---

### View Current User

As a logged-in user,  
I want to view my account information,  
so that the app can show my profile and permissions.

Acceptance Criteria:

- User can view their own basic profile.
- User can see their username, display name, and email.
- User cannot view private account information of other users.

---

## Communities

### Create Community

As a registered user,  
I want to create a new community,  
so that I can manage my own online social space.

Acceptance Criteria:

- User can enter community name, slug, and description.
- Community slug must be unique.
- The creator becomes the community owner.
- New community is visible on the user dashboard.

---

### View Community

As a visitor or member,  
I want to view a community page,  
so that I can see its description, posts, and members.

Acceptance Criteria:

- Public communities can be viewed by anyone.
- Private communities can only be viewed by members.
- Community page shows name, description, owner, and recent posts.

---

### Join Community

As a registered user,  
I want to join a community,  
so that I can participate in discussions.

Acceptance Criteria:

- User can join a public community.
- User cannot join the same community twice.
- After joining, the user becomes a community member.
- Joined community appears on the user dashboard.

---

### Leave Community

As a community member,  
I want to leave a community,  
so that I am no longer part of that community.

Acceptance Criteria:

- Member can leave a community.
- Community owner cannot leave unless ownership is transferred or community is deleted.
- After leaving, the community is removed from the user dashboard.

---

## Posts

### Create Post

As a community member,  
I want to create a post,  
so that I can share updates with the community.

Acceptance Criteria:

- Member can create a text post.
- Post must belong to a community.
- Empty posts are not allowed.
- New post appears in the community feed.

---

### View Community Feed

As a community member,  
I want to view posts in a community,  
so that I can read updates and discussions.

Acceptance Criteria:

- Posts are displayed newest first.
- Each post shows author, content, and created date.
- Feed only shows posts from the selected community.

---

### Delete Own Post

As a post author,  
I want to delete my own post,  
so that I can remove content I no longer want visible.

Acceptance Criteria:

- Author can delete their own post.
- Deleted post no longer appears in the feed.
- Other users cannot delete the post unless they are an admin or owner.

---

## Comments

### Add Comment

As a community member,  
I want to comment on a post,  
so that I can participate in discussions.

Acceptance Criteria:

- Member can comment on posts in communities they belong to.
- Empty comments are not allowed.
- Comment shows author, content, and created date.

---

### Delete Own Comment

As a comment author,  
I want to delete my own comment,  
so that I can remove my response.

Acceptance Criteria:

- Author can delete their own comment.
- Admin or owner can delete any comment in their community.
- Deleted comment no longer appears under the post.

---

## Likes

### Like Post

As a community member,  
I want to like a post,  
so that I can show support or agreement.

Acceptance Criteria:

- Member can like a post.
- Member can only like the same post once.
- Like count increases after liking.

---

### Unlike Post

As a community member,  
I want to unlike a post,  
so that I can remove my reaction.

Acceptance Criteria:

- Member can remove their own like.
- Like count decreases after unliking.
- User cannot unlike a post they have not liked.

---

## Community Administration

### Manage Members

As a community owner,  
I want to view community members,  
so that I can manage who belongs to my community.

Acceptance Criteria:

- Owner can view all members.
- Member list shows username, role, and joined date.
- Owner can remove members from the community.

---

### Delete Inappropriate Post

As a community owner or admin,  
I want to delete inappropriate posts,  
so that I can moderate the community.

Acceptance Criteria:

- Owner or admin can delete any post in their community.
- Regular members cannot delete posts by other users.
- Deleted posts are removed from the community feed.

---

### Update Community Settings

As a community owner,  
I want to update community settings,  
so that I can change the name, description, and visibility.

Acceptance Criteria:

- Owner can update community name and description.
- Owner can change community visibility.
- Non-owners cannot update community settings.

---

# Future User Stories

## Image Uploads

As a community member,  
I want to upload images to posts,  
so that I can share visual content.

## Notifications

As a community member,  
I want to receive notifications,  
so that I know when someone comments on or likes my post.

## Invite Links

As a community owner,  
I want to create invite links,  
so that I can invite people to join my community.

## AI Community Rules

As a community owner,  
I want AI to generate community rules,  
so that I can quickly create clear guidelines for members.

## AI Post Summary

As a community member,  
I want AI to summarize long discussions,  
so that I can quickly understand important points.

## Custom Branding

As a community owner,  
I want to customize the logo, color, and cover image,  
so that my community has its own brand identity.

## Analytics Dashboard

As a community owner,  
I want to see community analytics,  
so that I can understand member growth and engagement.
