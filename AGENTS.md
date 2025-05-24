# Denys Lazarenko's Personal Blog - Repository Documentation

## Overview

This repository hosts a personal blog and portfolio website for Denys Lazarenko, an AI Engineer focused on Generative AI and Robotics. The site is built using Jekyll, a static site generator that transforms plain text into beautiful websites and blogs.

## Repository Structure

The repository is organized as follows:

- **`_posts/`**: Contains all blog articles in Markdown format (e.g., `2024-09-26-reliable_planning.md`)
- **`_layouts/`**: Contains Jekyll layout templates
- **`_includes/`**: Contains reusable HTML components
- **`images/`**: Stores images used throughout the site
- **`css/`**: Contains stylesheets
- **`js/`**: Contains JavaScript files
- **`_config.yml`**: Main configuration file for the Jekyll site

## Blog Content

The blog features in-depth articles about:
- AI Agents and planning
- Collective memory for AI systems
- RAG (Retrieval-Augmented Generation) pipelines
- LLM evaluation techniques
- AI-powered browser automation
- Research tools

## Getting Started

### Prerequisites

To run this website locally, you'll need:

1. Ruby (version 2.5.0 or higher)
2. RubyGems
3. GCC and Make

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/denyslazarenko/denyslazarenko.github.io.git
   cd denyslazarenko.github.io
   ```

2. Install Jekyll and dependencies:
   ```bash
   gem install jekyll bundler
   bundle install
   ```

3. Run the development server:
   ```bash
   bundle exec jekyll serve
   ```

4. Open your browser and navigate to http://localhost:4000

## Customization

### Adding a New Blog Post

1. Create a new file in the `_posts` directory following the naming convention: `YYYY-MM-DD-title.md`
2. Add the following YAML front matter at the top of the file:
   ```yaml
   ---
   title: Your Post Title
   layout: post
   use_toc: true
   excerpt: Brief description of your post
   ---
   ```
3. Write your content in Markdown format
4. To include centered images, use the following HTML structure:
   ```html
   <div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
       <img src="{{ site.baseurl }}/images/your-image.png" style="max-width: 100%; height: auto;"/>
   </div>
   ```

### Configuration

Edit the `_config.yml` file to customize:
- Site title and description
- Build settings
- HTML compression options

## Deployment

This website is hosted using GitHub Pages. When changes are pushed to the main branch, GitHub automatically builds and deploys the updated site.
ion about Jekyll, visit [jekyllrb.com](https://jekyllrb.com/).