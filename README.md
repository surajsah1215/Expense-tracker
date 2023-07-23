# Day to Day Expense

Description:
The Day-to-Day Expense Management System is a web application designed to help users manage their daily expenses effectively. It allows users to sign up, log in, and add their expenses using price input fields, description input fields, and category selection. The system provides two premium features that enhance the user experience.

Key Features:

User Authentication: New users can sign up for the system and existing users can log in securely to manage their expenses.

Expense Tracking: Users can add, edit, and delete their expenses, which are then listed chronologically for easy reference.

Premium Features:
a. Expense Downloading: Subscribers can download their expense records in a convenient file format. The system stores these files securely in an AWS S3 bucket.
b. View Other Users' Expenses: Premium users have access to view expenses of other users along with their names.

Razorpay Gateway Integration: The system is integrated with Razorpay, a payment gateway, to facilitate premium feature activation through secure payment processing.

Tech Stack:

Front-end: HTML, CSS, JavaScript
Back-end: Node.js, Express.js
Database: AWS Relational Database Service (RDS) using Sequelize ORM
Hosting: AWS EC2 Instance with Elastic IP for consistent accessibility
Payment Integration: Razorpay
Cloud Storage: AWS S3 Bucket for securely storing downloadable expense records
Reverse Proxy: Nginx for improved performance and security
Responsibilities:

Designed and implemented the user authentication system, allowing users to securely access their expense data.
Developed the expense tracking feature, enabling users to add, edit, and delete expenses.
Integrated Razorpay to enable users to activate premium features with secure payment processing.
Implemented the Expense Downloading feature, utilizing AWS S3 for secure file storage and retrieval.
Developed the functionality to allow premium users to view expenses of other users, enhancing the platform's collaborative aspect.
Hosted the application on an AWS EC2 instance with Elastic IP for a consistent user experience.
Results:
The Day-to-Day Expense Management System was successfully developed and deployed, providing users with an intuitive platform to track and manage their expenses efficiently. The premium features incentivized user engagement and contributed to the application's revenue generation.
