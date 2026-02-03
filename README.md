# MINDVIA - Mental Health & Psychology App

A premium mobile application for Clinical Psychologist Teona Khametova, offering psychological services, educational courses, and self-help tools. Built with React Native and Expo for iOS, Android, and Web platforms.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-Private-red)

## Overview

MINDVIA is a comprehensive mental wellness platform designed to bridge the gap between professional psychological support and accessible self-help tools. The app serves clients in Czech Republic and internationally through online consultations.

### Key Features

**Professional Services**
- Individual psychological consultations
- Regression therapy sessions
- Family constellations therapy
- Online and in-person appointments

**Anti-Anxiety Emergency Toolkit**
- **Breathing Exercises** - 4-7-8 technique for rapid calming
- **Grounding Practice** - 5-4-3-2-1 sensory technique
- **CBT Thought Analysis** - Cognitive restructuring tools
- **Body Stabilization** - Somatic relaxation exercises

**Mood & Emotion Tracker**
- Daily emotional check-ins
- Anxiety level monitoring (1-10 scale)
- Body sensation awareness
- Thought journaling
- Personal insights and patterns

**MINDVIA Educational School**
- Psychology courses and masterclasses
- Self-development programs
- Structured learning paths

**Additional Features**
- Educational articles and resources
- Client testimonials
- User authentication and profiles
- Secure local data storage

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.81.5 |
| Platform | Expo SDK 54 |
| Navigation | Expo Router (file-based) |
| State | React Hooks + AsyncStorage |
| Styling | React Native StyleSheet |
| Icons | Expo Vector Icons |
| Animations | React Native Reanimated |
| Language | TypeScript 5.9 |

## Architecture

```
app/
├── _layout.tsx              # Root layout with drawer navigation
├── index.tsx                # Home screen
├── auth.tsx                 # Authentication screen
├── profile.tsx              # User profile management
├── psychologist.tsx         # Psychologist information
├── contact.tsx              # Contact & booking
├── courses.tsx              # Educational courses
├── education.tsx            # Learning resources
├── reviews.tsx              # Client testimonials
├── antianxiety/             # Emergency toolkit module
│   ├── index.tsx            # Toolkit overview
│   ├── breathing.tsx        # Breathing exercises
│   ├── grounding.tsx        # Grounding technique
│   ├── cbt.tsx              # Cognitive behavioral tools
│   ├── body.tsx             # Body stabilization
│   └── reflection.tsx       # Guided reflection
├── tracker/                 # Mood tracking module
│   ├── index.tsx            # Daily check-in
│   └── response.tsx         # AI-generated insights
├── services/                # Professional services
│   ├── index.tsx            # Services overview
│   └── [id].tsx             # Service details
├── articles/                # Educational content
│   ├── index.tsx            # Articles list
│   └── [id].tsx             # Article detail
└── program/                 # Structured programs
    ├── index.tsx            # Program overview
    └── [day].tsx            # Daily content

components/
├── BackgroundWrapper.tsx    # Gradient background
├── CustomDrawerContent.tsx  # Navigation drawer
└── ui/                      # Reusable UI components

services/
├── auth.ts                  # Authentication logic
└── database.ts              # Local storage management

constants/
├── theme.ts                 # Design tokens
└── program.ts               # Program content
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Studio (optional)

### Installation

```bash
git clone https://github.com/Iusif797/psymindvia_react_native-.git
cd psymindvia_react_native-

npm install
```

### Development

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#7EC8E3` | Interactive elements, trust |
| Calm Green | `#7DCEA0` | Success, calm states |
| Soft Purple | `#C9A0FF` | Learning, creativity |
| Warm Coral | `#F5B7B1` | Emotion, warmth |
| Alert Red | `#C75450` | Emergency, high anxiety |
| Background | `#1a1a2e` | Dark theme base |

### Typography

- **Primary Font**: Georgia (iOS), Serif (Android)
- **Heading Scale**: 34px / 28px / 22px / 18px
- **Body**: 16px / 14px
- **Caption**: 13px / 12px

## Supported Platforms

| Platform | Minimum Version | Status |
|----------|-----------------|--------|
| iOS | 13.0+ | ✅ Production Ready |
| Android | API 21+ (5.0) | ✅ Production Ready |
| Web | Modern browsers | ✅ Production Ready |

## Performance

- **New Architecture**: Enabled for optimal performance
- **React Compiler**: Experimental support enabled
- **Typed Routes**: Full TypeScript route safety
- **Optimized Images**: Expo Image with caching

## Security

- Local authentication with hashed passwords
- Secure AsyncStorage for sensitive data
- No external API dependencies for core features
- GDPR-compliant data handling

## Contributing

This is a private project for MINDVIA Psychology Practice. For inquiries, please contact through the official channels.

## License

Private and proprietary. All rights reserved.

---

**MINDVIA** - Your path to mental wellness begins here.
