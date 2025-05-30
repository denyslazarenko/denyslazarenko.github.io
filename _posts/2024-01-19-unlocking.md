---
title: AI-Powered Automation for Browser Tasks
layout: post
use_toc: true
excerpt: Unlocking AHA Moments
---
## Introduction: Navigating the Maze of Modern Web Platforms

Have you ever felt overwhelmed while using a sophisticated web platform, like Google Cloud, due to its plethora of options? 
This common challenge hinders many users from fully utilizing these powerful tools. 

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Unlocking_AHA_Moments/gcp.png" style="width: 70%;"/>
</div>

The way better experience could the following: you have a chat assistant which would 
ask you about your goal and then would guide you through the process of achieving it or even 
better doing it for you!

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Unlocking_AHA_Moments/better_experience.png" style="width: 70%;"/>
</div>

My recent pitch at an [AI Tinkerers](https://munich.aitinkerers.org/) event presented an innovative solution that we developed at [pyne](pyne.ai) to this problem, harnessing AI to simplify and personalize user interaction with complex websites.

## Our Approach: Simplifying the User Journey

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Unlocking_AHA_Moments/chrome_extension.png" style="width: 20%;"/>
</div>

Achieving this requires significant processing power to understand and navigate 
a website's structure, a task often too complex and costly. Our solution? 
We focus on identifying and recording the most common user flows, offering detailed, 
AI-driven demonstrations for end customer. It could be in the form of a video, chatbot, interactive guide 
or even automation that makes clicks over the website.

### The Process
1. **Capturing User Interaction**: We developed a browser extension to record user clicks and voice. I would like to emphasize that the output is not a traditional video recording, it is events file that captures a DOM of a website and an audio recording.
2. **Analyzing Data**: The captured data, including an `events.json` and `audio.webm`, undergo processing to filter out relevant information from user actions and website structure data.
3. **Creating the Tour**: The refined data is then used to construct a user tour on our platform, which can be edited for precision.
4. **Presenting the Guide**: The final step involves integrating the guide into the user's web experience, either through a Chrome extension or a future SDK.

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Unlocking_AHA_Moments/guide.png" alt="Image 2" style="width: 75%;"/>
</div>

### The Output

- The tour highlights specific webpage elements accompanied by text explanations, enhancing user understanding and engagement.
- Our platform supports various formats, including videos, chats, and automated tours.
- Leveraging a rich database of actions, we can automate tasks based on user input, like integrating Notion seamlessly.

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Unlocking_AHA_Moments/click_tour.png" alt="Image 3" style="width: 70%;"/>
</div>

## Technical Underpinnings: GPT's Role

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Unlocking_AHA_Moments/system_design.png">
</div>

Our system utilizes GPT capabilities in several key areas:

- **Transcription of Voice to Text**: Converting user voice input into actionable text.
- **Aligning Clicks with Transcription**: We use time stamps and the DOM structure to synchronize user actions with their verbal instructions.
- **Selector Selection**: Addressing the challenge of selecting reliable CSS selectors or XPaths, we are developing a prototype for semantic analysis of selectors.
- **Generating Interactive Sections**: Creating user-friendly tooltips and interactive elements.
- **Storing and Retrieving Click Information**: A vector store enables efficient retrieval of specific user actions and related information.

## The Competitive Landscape

1. **Adept**: With over $200M in funding, Adept is training foundational models for visual reasoning across web pages.
2. **Induced AI**: Backed by Sam Altman, they focus on Robotic Process Automation.
3. **Open-Source Contributions**: Pioneers like Andrej Karpathy and projects like natbot and webLM.

## Why This Matters?
Our end-to-end solution begins with a simple browser extension and culminates in an immersive, AI-crafted product tour.  This topic matters to SaaS companies because, if they are honest, most of their users have no clue about their product’s capabilities. Wit our AI-first solution to this problem, we enable them to hyperpersonalise their product’s experience to each user, thus democratizing access to complex web platforms, making technology more approachable and user-friendly.


<div style="text-align: center; padding-top: 40px; padding-bottom: 40px;">
    <iframe src="https://pitch.com/embed-link/zwgjt3" allow="fullscreen" allowfullscreen="" width="800" height="600" style="border:0"></iframe>
</div>