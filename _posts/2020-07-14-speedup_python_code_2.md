---
title: Ways to speed up a python program2
layout: post
use_toc: true
excerpt: Ways to speed up a python program2
---
## Introduction: Navigating the Maze of Modern Web Platforms


Have you ever felt overwhelmed while using a sophisticated web platform, like Google Cloud, due to its plethora of options? 
This common challenge hinders many users from fully utilizing these powerful tools. 

![image](./images/Unlocking_AHA_Moments/gcp.png)

The way better experience could the following: you have a chat assistant which would 
ask you about your goal and then would guide you through the process of achieving it or even 
better doing it for you!

![image](./images/Unlocking_AHA_Moments/better_experience.png)

My recent pitch at an [AI Tinkerers](https://munich.aitinkerers.org/) event presented an innovative solution that we developed at [pyne](pyne.ai) to this problem, harnessing AI to simplify and personalize user interaction with complex websites.

## Our Approach: Simplifying the User Journey

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

### The Output

- The tour highlights specific webpage elements accompanied by text explanations, enhancing user understanding and engagement.
- Our platform supports various formats, including videos, chats, and automated tours.
- Leveraging a rich database of actions, we can automate tasks based on user input, like integrating Notion seamlessly.

<p align="center">
  <img src="./images/Unlocking_AHA_Moments/chrome_extension.png" alt="Image 1" style="width: 30%;"/>
  <img src="./images/Unlocking_AHA_Moments/guide.png" alt="Image 2" style="width: 30%;"/>
  <img src="./images/Unlocking_AHA_Moments/click_tour.png" alt="Image 3" style="width: 30%;"/>
</p>


## Technical Underpinnings: GPT's Role

![image](./images/Unlocking_AHA_Moments/system_design.png)


Our system utilizes GPT capabilities in several key areas:

- **Transcription of Voice to Text**: Converting user voice input into actionable text.
- **Aligning Clicks with Transcription**: We use time stamps and the DOM structure to synchronize user actions with their verbal instructions.
- **Selector Selection**: Addressing the challenge of selecting reliable CSS selectors or XPaths, we are developing a prototype for semantic analysis of selectors.
- **Generating Interactive Sections**: Creating user-friendly tooltips and interactive elements.
- **Storing and Retrieving Click Information**: A vector store enables efficient retrieval of specific user actions and related information.

![image](./images/Unlocking_AHA_Moments/selectors.png)


## The Competitive Landscape

1. **Adept**: With over $200M in funding, Adept is training foundational models for visual reasoning across web pages.
2. **Induced AI**: Backed by Sam Altman, they focus on Robotic Process Automation.
3. **Open-Source Contributions**: Pioneers like Andrej Karpathy and companies like Cohere are contributing significantly to this field through projects like natbot and webLM.

![image](./images/Unlocking_AHA_Moments/adept.png)
![image](./images/Unlocking_AHA_Moments/induced_ai.png)
![image](./images/Unlocking_AHA_Moments/open_source_projects.png)

## Why This Matters to Our Audience

This topic resonates with our audience because it represents a cutting-edge technical challenge, bridging AI and user experience. Our end-to-end solution begins with a simple browser extension and culminates in an immersive, AI-crafted product tour. This approach not only enhances user interaction but also democratizes access to complex web platforms, making technology more approachable and user-friendly.
