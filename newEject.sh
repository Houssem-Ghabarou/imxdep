#!/bin/bash

# Exit immediately if a command fails
set -e

echo "🔧 What do you want to do?"
echo "1) Prebuild Expo project"
echo "2) Run Android app"
echo "3) Clean Gradle build files"
echo "4) Install dependencies"
echo "5) Prebuild & Run Android"
echo "6) Do everything"
echo "7) Build Debug APK"
echo "8) Build Release APK"
echo "9) Exit"

read -p "Enter your choice (1-9): " choice

if [[ $choice -eq 9 ]]; then
    echo "❌ Exiting..."
    exit 0
fi

# Install dependencies if chosen
if [[ $choice -eq 4 || $choice -eq 6 ]]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Prebuild if chosen
if [[ $choice -eq 1 || $choice -eq 5 || $choice -eq 6 ]]; then
    echo "🛠️ Running Expo prebuild..."
    npx expo prebuild
fi

# Clean Gradle if chosen
if [[ $choice -eq 3 || $choice -eq 6 ]]; then
    echo "🧹 Cleaning Gradle build files..."
    cd android && ./gradlew clean && cd ..
fi

# Run on Android if chosen
if [[ $choice -eq 2 || $choice -eq 5 || $choice -eq 6 ]]; then
    echo "🚀 Running Expo on Android..."
    npx expo run:android
fi

# Build Debug APK
if [[ $choice -eq 7 ]]; then
    echo "📦 Building Debug APK..."
    cd android && ./gradlew assembleDebug && cd ..
    APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
    
    if [[ -f "$APK_PATH" ]]; then
        echo "✅ Debug APK built successfully: $APK_PATH"
    else
        echo "❌ Debug APK not found!"
    fi
fi

# Build Release APK
if [[ $choice -eq 8 ]]; then
    echo "🔐 Building Release APK..."
    cd android && ./gradlew assembleRelease && cd ..
    APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
    
    if [[ -f "$APK_PATH" ]]; then
        echo "✅ Release APK built successfully: $APK_PATH"
    else
        echo "❌ Release APK not found! Ensure you have a signing key configured."
    fi
fi

echo "✅ Done!"
