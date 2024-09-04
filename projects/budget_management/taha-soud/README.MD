# Overview
The Budget Management Application is a simple financial tool designed to help users manage their money, perform transactions, and track their financial status. The application allows users to create accounts, deposit money, send money to other users, and view the top users based on their balance.

# Features
User Management: Create and manage user accounts.
Deposit: Add money to user accounts.
Money Transfer: Send money between users.
Top Users: View the top users by balance.

# Design
## Classes
1. User
Represents a user in the application.

### Attributes:

userName (String): The unique username of the user.
firstName (String): The first name of the user.
lastName (String): The last name of the user.
balance (Number): The account balance of the user (default is 0).

2. UserFactory
A factory class for creating User instances.

Methods:

static createUser(userName, firstName, lastName): Creates and returns a new User instance.
3. BudgetApp
The main application class, implemented as a singleton to ensure there is only one instance.

# Attributes:

users (Array): A list of users in the application.
Methods:

-static getInstance(): Returns the singleton instance of the application.

-createUser(userName, firstName, lastName): Creates a new user and adds them to the application.
-deposit(userName, amount): Deposits money into a user's account.
-sendMoney(sender, receiver, amount): Transfers money from one user to another.
-topUsers(n): Returns the top n users based on balance.