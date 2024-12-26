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
In case of an emergency, the SOS feature allows users to tap a button that triggers a fake call. During this call, the app records audio or video of the situation, capturing important details. These recordings are then automatically sent to the pre-listed emergency contacts or the designated authorities for swift response and action. This ensures that the incident is documented with both SOS video capturing and SOS audio capturing, which can serve as valuable evidence for any case.

Additionally, if you encounter network connectivity issues or cannot open the app, predefined mobile gestures (e.g., pressing the power button multiple times) can automatically trigger an emergency call, ensuring that emergency services or contacts are notified and assistance is on its way, even without internet access or opening the app.
### Mobile Gestures:
The mobile gesturing process is designed to provide an additional layer of safety in case you cannot access the app due to network issues, app unresponsiveness, or other emergencies. This feature allows users to trigger an emergency action pressing the power button multiple times (typically 3 to 5 times) can activate an emergency call or the SOS feature without directly interacting with the phone's screen.
#### Initiates SOS Action:
The app automatically starts recording audio or video of the situation, just like the SOS button within the app.
#### Emergency Call Activation:
If the app is unable to send the SOS alert directly due to network issues, the gesture can initiate an emergency call to pre-listed contacts or emergency services.
#### Notifies Authorities: 
Once the gesture activates the SOS feature, the app will send the audio/video recording to the designated authorities or emergency contacts in your list.


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

[Frontend Link](https://admin-glowhive.netlify.app/)

## Backend
Server Framework: Node.js with Express.js (for handling APIs and business logic)
Database:
MongoDB (NoSQL database for complaint and user data)
Authentication:  JWT (JSON Web Token)

[Backen Link](https://tech-hackathon-glowhive.onrender.com)]

## Postman Api link

[https://personal-7797.postman.co/workspace/Yasvanth's-Public~bb5e14a1-c352-4798-9158-20eb9e952c65/documentation/29852891-e3a2ba42-f3ce-49b4-af10-0f5e8b00c4f4](https://personal-7797.postman.co/workspace/Yasvanth's-Public~bb5e14a1-c352-4798-9158-20eb9e952c65/documentation/29852891-e3a2ba42-f3ce-49b4-af10-0f5e8b00c4f4)


## Hosting
Cloud Provider:
AWS (Amazon Web Services) or Google Cloud Platform (GCP)
Firebase Cloud Functions (for serverless event handling)

## Notifications
Push Notifications: Firebase Cloud Messaging (FCM)
Real-Time Updates: Socket.IO (for instant status updates and SOS responses)

## Security

### NoSQL Injection Prevention:
Use parameterized queries or ORMs like Mongoose, and validate inputs with express-validator to prevent injection attacks.

### XSS Prevention: 
Sanitize user-generated content with DOMPurify and implement a Content Security Policy (CSP) to block malicious scripts.

### CSRF Protection:
Use CSRF tokens and set SameSite cookie attributes to prevent cross-site attacks.

### Unsafe Redirects:
Validate and whitelist URLs before redirecting users to prevent malicious redirects.

### Malicious File Uploads:
Validate file types, scan uploads with tools like ClamAV, and store files securely outside the web root.

### Session Handling:
Secure sessions with Redis or JWT tokens, and ensure cookies are marked as HttpOnly, Secure, and SameSite.

### Input Sanitization:
Use libraries like express-validator or Joi to sanitize and validate all inputs before processing.


## SOS Feature and Gestures
Gesture Recognition: Native platform capabilities (Android/iOS) using APIs like:
Android: Accessibility Services, Broadcast Receivers for Power Button detection
iOS: Gesture Recognizers and Motion APIs
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

# Future Implementations

## Triple Click Functionality
A Triple-Click Functionality triggers specific actions when a user taps three times consecutively on a UI element. It can enhance accessibility (e.g., activating voice assistance), provide quick shortcuts (e.g., opening hidden settings), or handle emergencies (e.g., sending an SOS).

### Implementation involves:

Detecting three clicks within a set time (e.g., 500ms).
Linking it to desired actions like activating features or shortcuts.

## Mobile WhatsApp/message sending instead of email:
To implement WhatsApp/message sending instead of email in a mobile app, users can be directed to WhatsApp with a pre-filled message. However, there are no free software solutions currently available for sending WhatsApp messages directly from third-party apps due to WhatsApp’s strict API usage policies.

## Integration of parents/friends in sos
The SOS feature in your app can send distress signals to parents and friends by allowing users to add them as emergency contacts. When activated, the app sends a message with the user’s location to these contacts via SMS, WhatsApp, or email. It can include real-time location updates and provide a silent mode for discretion. Additionally, contacts can confirm they received the alert and offer assistance.

## Filtering vulgar/inappropriate complanints using any ML model to prevent unneccesary complaints:
To filter vulgar or inappropriate complaints using Machine Learning (ML):

Data Collection: Gather labeled complaint data (appropriate vs. inappropriate).
Preprocessing: Clean the text (remove stop words, tokenize, lowercase).
Model Selection: Use models like SVM, RNNs, or BERT for text classification.
Training: Train the model on labeled data to detect inappropriate content.
Filtering: Classify incoming complaints and flag inappropriate ones for review.
Libraries like scikit-learn, TensorFlow, or PyTorch can help, and the model should be regularly updated for accuracy

# Team Details
1)Yasvanth-N210368<br>
2)Mohan-N210770<br>
3)Sri babu-N210522<br>
4)Nakshatra-N210615
