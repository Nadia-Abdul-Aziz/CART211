//UNUSED CODE
//I PUT EVERYTING IN THE ACTUAL SETTINGS PAGE!!!!!!!!








//import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
// import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
// import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";

// const FirebaseManager = {
//     // Firebase configuration
//     config: {
//         apiKey: "AIzaSyD7obDJVcpvi4sFWzysSJHak5zVofsAeDU",
//         authDomain: "thewebsite-1217a.firebaseapp.com",
//         projectId: "thewebsite-1217a",
//         storageBucket: "thewebsite-1217a.firebasestorage.app",
//         messagingSenderId: "887401115449",
//         appId: "1:887401115449:web:9fbe36e0c610dcded742e8",
//         measurementId: "G-QDFGZ7RVSP"
//     },

//     // Initialize Firebase services
//     services: {
//         init() {
//             this.app = initializeApp(this.config);
//             this.auth = getAuth(this.app);
//             this.database = getDatabase(this.app);
//             this.analytics = getAnalytics(this.app);
//             return this;
//         },

//         app: null,
//         auth: null,
//         database: null,
//         analytics: null
//     },

//     // Authentication methods
//     auth: {
//         async signInAnonymously() {
//             try {
//                 const userCredential = await signInAnonymously(FirebaseManager.services.auth);
//                 return userCredential.user.uid;
//             } catch (error) {
//                 console.error("Authentication error:", error);
//                 throw error;
//             }
//         }
//     },

//     // Settings management
//     settings: {
//         // Default settings template
//         defaultSettings: {
//             typeSpeed: 100,
//             backSpeed: 100,
//             theme: 'default',
//             lastUpdated: null
//         },

//         // Save settings to Firebase
//         async save(userSettings) {
//             try {
//                 const userId = await FirebaseManager.auth.signInAnonymously();
//                 const settingsRef = ref(
//                     FirebaseManager.services.database,
//                     `typing_settings/${userId}`
//                 );

//                 // Merge default settings with user-provided settings
//                 const finalSettings = {
//                     ...this.defaultSettings,
//                     ...userSettings,
//                     lastUpdated: new Date().toISOString()
//                 };

//                 await set(settingsRef, finalSettings);
//                 console.log("Settings saved successfully");
//                 return finalSettings;
//             } catch (error) {
//                 console.error("Error saving settings:", error);
//                 throw error;
//             }
//         },

//         // Retrieve settings from Firebase
//         async get() {
//             return new Promise(async (resolve, reject) => {
//                 try {
//                     const userId = await FirebaseManager.auth.signInAnonymously();
//                     const settingsRef = ref(
//                         FirebaseManager.services.database,
//                         `typing_settings/${userId}`
//                     );

//                     const snapshot = await get(settingsRef);
//                     const data = snapshot.val();

//                     // Return merged settings or default if no data
//                     const settings = data
//                         ? { ...this.defaultSettings, ...data }
//                         : { ...this.defaultSettings };

//                     resolve(settings);
//                 } catch (error) {
//                     console.error("Authentication or retrieval error:", error);
//                     reject(error);
//                 }
//             });
//         }
//     }
// };

// // Initialize services immediately
// FirebaseManager.services.init();

// export default FirebaseManager;
