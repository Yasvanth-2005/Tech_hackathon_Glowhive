# Tech_hackathon_Glowhive
Welcome to Girl Grievances, your go-to solution for grievances and safety. Register to access features like filing complaints, tracking their status, and using the SOS button for emergencies. Categorize issues as critical/non-critical, track updates, and review complaint history for transparency.

# Project Overview
Girl Grievances is a mobile application designed to address women's grievances, specifically focusing on workplace safety and incidents of sexual harassment. The app provides a secure, user-friendly platform for reporting and managing complaints while ensuring swift and appropriate action. By incorporating innovative features like SOS alerts and criticality-based escalation, Girl Grievances aims to empower women and foster a safer environment.
![USERS](https://github.com/user-attachments/assets/5347f25e-98a2-4a3c-a3de-b42634d63d5a)



## Key Features:
### Complaint Filing:
Users can file complaints categorized by severity (critical/non-critical). Critical cases are escalated directly to higher authorities, while non-critical ones follow a low-to-high reporting hierarchy.

### Complaint Status Tracking:
Users can monitor the progress of their complaints, receive updates, and resend notifications if necessary.

### SOS Feature:
In emergencies, users can trigger the SOS button to record audio or video via a fake call. The recording is sent to designated officials or emergency contacts. Mobile gestures, such as pressing the power button multiple times, are also supported for activating the SOS feature.

### Complaint History:
A log of all filed complaints with their statuses is maintained, ensuring transparency and accountability.

### Notifications and Alerts:
Real-time notifications keep users informed about the progress of their cases and any emergency actions.

### Support and FAQ:
A dedicated section provides guidance and answers to common queries for smooth navigation.

With a focus on security, transparency, and swift action, [App Name] aims to be a reliable companion in addressing grievances and promoting workplace safety for women.

# Tech stack used
The tech stack for your app can be organized into the following categories:

## Frontend
Framework/Library: Flutter
UI/UX Design: Figma or Adobe XD (for designing app layouts and user flows)
State Management: Redux or Context API
Styling: Styled Components, Tailwind CSS
## Backend
Server Framework: Node.js with Express.js (for handling APIs and business logic)
Database:
MongoDB (NoSQL database for complaint and user data)
Authentication:  JWT (JSON Web Token)
## Cloud and Hosting
Cloud Provider:
AWS (Amazon Web Services) or Google Cloud Platform (GCP)
Firebase Cloud Functions (for serverless event handling)

## Notifications
Push Notifications: Firebase Cloud Messaging (FCM)
Real-Time Updates: Socket.IO (for instant status updates and SOS responses)
## Security
Encryption:
HTTPS for secure data transmission
AES or RSA for sensitive data like recordings
Access Control: Role-based authorization for different levels of authority
## SOS Feature and Gestures
Gesture Recognition: Native platform capabilities (Android/iOS) using APIs like:
Android: Accessibility Services, Broadcast Receivers for Power Button detection
iOS: Gesture Recognizers and Motion APIs
## DevOps
Version Control: Git and GitHub
CI/CD Tools: GitHub Actions, Jenkins, or Bitrise (for automated builds and deployments)
## Testing
Frontend Testing: Jest, Detox (for React Native apps)
API Testing: Postman, Newman
End-to-End Testing: Cypress
## Other Tools
Project Management: Jira, Trello, or Notion
Documentation: Markdown (for README and in-app Help Pages)
Analytics: Google Analytics for Firebase or Mixpanel

This stack ensures scalability, real-time functionality, and robust security, aligning with your app's requirements.

# Setup & Installation Instructions 
Follow these steps to set up and run the app locally:

## Prerequisites
Ensure you have the following tools installed on your system:

Node.js (LTS version recommended): Download Node.js
npm (comes with Node.js) or Yarn for package management.
React Native CLI or Expo CLI (for app development).
Android Studio (for Android emulation).
Xcode (for iOS emulation, macOS only).
Git for version control.
## Backend Setup
1) Clone the Repository
2) Install Dependencies
3) Set Environment Variables
4) Start the Backend Server
## Frontend Setup
1)Navigate to the Frontend Directory
2)Install Dependencies
3)Set Up Environment Variables
4)Run the Frontend Application
## Database Setup
1)Use MongoDB for Data Management
2)Migrate or Seed Data 
## Running on Emulators or Physical Devices
### Android:
1)Open Android Studio, and ensure an emulator is running.
2)Run the app
### iOS:
1)Open Xcode, and set up an iOS simulator.
2)Run the app
## Building the App
1)Android (APK)
2)iOS 
## Testing and Debugging
Use React Developer Tools to debug UI components.
Use Postman to test API endpoints.
# Team Details
1)Yasvanth-N210368
2)Mohan-N210770
3)Sri babu-N210522
4)Nakshatra-N210615
