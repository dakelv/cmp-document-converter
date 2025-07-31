# Git Knowledge Guide
*A comprehensive reference based on real-world learning experiences*

## 📋 Table of Contents
1. [Basic Git Concepts](#basic-git-concepts)
2. [Daily Development Workflow](#daily-development-workflow)
3. [Version Control & Releases](#version-control--releases)
4. [Troubleshooting Common Issues](#troubleshooting-common-issues)
5. [GitHub Integration](#github-integration)
6. [Advanced Scenarios](#advanced-scenarios)
7. [Command Reference](#command-reference)

---

## 🎯 Basic Git Concepts

### **The Three Areas of Git**
```
Working Directory  →  Staging Area  →  Repository
     (Modified)         (Staged)        (Committed)
```

### **Key Terms**
- **Repository (Repo)**: Your project folder with Git tracking
- **Commit**: A snapshot of your code at a specific point in time
- **Branch**: A parallel version of your code (main branch is primary)
- **Remote**: The online version of your repository (usually GitHub)
- **Origin**: Default name for your remote repository
- **HEAD**: Pointer to your current commit
- **Tag**: A bookmark/label for a specific commit (like v2.0.0)
- **Release**: A published version on GitHub with download packages

---

## 🚀 Daily Development Workflow

### **Scenario 1: Starting Your Work Day**
```bash
# Navigate to your project
cd your-project-folder

# Get the latest changes from GitHub
git pull origin main

# Check current status
git status
```

### **Scenario 2: Making Changes and Saving Them**
```bash
# After editing files...

# See what you changed
git status
git diff

# Stage your changes (prepare for commit)
git add .                    # Stage all changes
git add filename.html        # Stage specific file

# Commit your changes (save snapshot)
git commit -m "Descriptive message about what you changed"

# Upload to GitHub
git push origin main
```

### **Scenario 3: Working from Multiple Computers**
```bash
# At work computer:
git add . && git commit -m "Work changes" && git push origin main

# At home computer (MUST pull first):
git pull origin main         # Get the work changes
# Then continue working...
```

---

## 🏷️ Version Control & Releases

### **Scenario 4: Creating Your First Release**
```bash
# After your code is stable and working:

# Create a tag (version bookmark)
git tag -a v1.0.0 -m "First stable release"

# Push the tag to GitHub
git push origin v1.0.0

# Then go to GitHub web interface to create the actual release
```

### **Scenario 5: Understanding Tags vs Releases**
```bash
# Tags = Git bookmarks (for developers)
git tag                      # List all tags
git tag -a v2.0.1 -m "Bug fixes"  # Create annotated tag

# Releases = GitHub packages (for users)
# Created via GitHub web interface from existing tags
# Shows in sidebar, has download links, release notes
```

### **Scenario 6: Viewing Different Versions**
```bash
# See all your versions
git tag                      # List tags
git log --oneline           # See commit history

# View specific version
git show v2.0.0             # Show tag details
git checkout v2.0.0         # Switch to that version
git checkout main           # Switch back to latest
```

### **Scenario 7: Comparing Versions**
```bash
# See what changed between versions
git diff v1.0.0..v2.0.0           # Compare two tags
git log v1.0.0..v2.0.0 --oneline  # See commits between versions
```

---

## 🔧 Troubleshooting Common Issues

### **Scenario 8: Push Rejected - Need to Pull First**
```bash
# Error: "Updates were rejected because the remote contains work..."

# Solution:
git pull origin main         # Get remote changes first
git push origin main         # Then push your changes
```

### **Scenario 9: Merge Conflicts**
```bash
# When git pull creates conflicts:

# 1. Git will show conflict markers in files:
# <<<<<<< HEAD
# Your changes
# =======
# Remote changes
# >>>>>>> commit-hash

# 2. Edit files to resolve conflicts (remove markers, keep what you want)

# 3. Stage and commit the resolution:
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### **Scenario 10: Undoing Changes**
```bash
# Undo uncommitted changes to a file:
git restore filename.html

# Undo last commit (keep changes):
git reset --soft HEAD~1

# Undo last commit (discard changes - DANGEROUS):
git reset --hard HEAD~1

# Revert a commit (safe - creates new commit that undoes):
git revert commit-hash
```

### **Scenario 11: Going Back to Previous Version**
```bash
# Safe way - create new commit that undoes changes:
git revert HEAD              # Undo last commit
git revert commit-hash       # Undo specific commit

# View history to find the commit you want to revert to:
git log --oneline
```

---

## 🌐 GitHub Integration

### **Scenario 12: Setting Up GitHub Repository**
```bash
# First time setup:
git init
git remote add origin https://github.com/username/repo-name.git
git branch -M main
git push -u origin main      # -u sets upstream for future pushes
```

### **Scenario 13: Cloning Existing Repository**
```bash
# Get a copy of existing repository:
git clone https://github.com/username/repo-name.git
cd repo-name
```

### **Scenario 14: Checking Repository Status**
```bash
# See what's different between local and remote:
git status
git log --oneline -5         # Recent commits
git remote -v                # Show remote URLs
git ls-remote --tags origin  # Show remote tags
```

---

## 🔍 Advanced Scenarios

### **Scenario 15: Working with Branches**
```bash
# Create and switch to new branch:
git checkout -b feature-branch

# Make changes, commit them:
git add . && git commit -m "New feature"

# Push new branch:
git push origin feature-branch

# Switch back to main:
git checkout main

# Merge feature into main:
git merge feature-branch
```

### **Scenario 16: Finding Information**
```bash
# Who changed what (blame):
git blame filename.html

# Search commit messages:
git log --grep="bug fix"

# Find when something was changed:
git log -p filename.html

# See what files changed in a commit:
git show commit-hash --name-only
```

### **Scenario 17: Cleaning Up**
```bash
# See what would be deleted:
git clean -n

# Delete untracked files:
git clean -f

# Delete untracked directories:
git clean -fd
```

---

## 📊 Command Reference

### **Essential Daily Commands**
```bash
git status                   # Check current state
git add .                    # Stage all changes
git commit -m "message"      # Save changes
git push origin main         # Upload to GitHub
git pull origin main         # Download from GitHub
```

### **Information Commands**
```bash
git log --oneline           # See commit history
git diff                    # See unstaged changes
git diff --staged           # See staged changes
git show commit-hash        # Show specific commit
git tag                     # List all tags
git remote -v               # Show remote URLs
```

### **Version Control Commands**
```bash
git tag -a v1.0.0 -m "msg"  # Create annotated tag
git push origin v1.0.0      # Push tag to remote
git checkout v1.0.0         # Switch to tagged version
git checkout main           # Switch back to main
```

### **Troubleshooting Commands**
```bash
git restore filename        # Undo changes to file
git reset --soft HEAD~1     # Undo last commit (keep changes)
git revert commit-hash      # Safely undo commit
git clean -f                # Remove untracked files
```

---

## 🎯 Best Practices

### **Commit Messages**
- **Good**: "Fix CMP title formatting in instructions"
- **Bad**: "changes" or "update"

### **When to Commit**
- **After completing a logical unit of work**
- **Before switching tasks**
- **At the end of each work session**

### **When to Create Tags/Releases**
- **When code is stable and tested**
- **Before major changes**
- **When ready to share with users**

### **Daily Workflow**
1. **Start**: `git pull origin main`
2. **Work**: Edit files
3. **Save**: `git add . && git commit -m "description"`
4. **Share**: `git push origin main`
5. **Release**: Create tags for stable versions

---

## 🚨 Important Warnings

### **Dangerous Commands (Use Carefully)**
```bash
git reset --hard            # DELETES changes permanently
git push --force            # Can overwrite others' work
git clean -f                # DELETES untracked files
```

### **Safe Alternatives**
```bash
git reset --soft            # Keeps your changes
git push --force-with-lease # Safer force push
git clean -n                # Preview what would be deleted
```

---

## 💡 Key Insights Learned

1. **Tags ≠ Releases**: Tags are Git bookmarks, Releases are GitHub packages
2. **Always pull before push**: Prevents conflicts and rejected pushes
3. **Commit messages matter**: They help you understand changes later
4. **Branches vs Tags**: Branches evolve, tags are frozen snapshots
5. **GitHub sidebar**: Shows latest published release, not just tags
6. **Working directory matters**: Git commands work in the repository folder
7. **Upstream setup**: Makes `git push` work without specifying remote/branch

---

## 🔗 Useful Resources

- **GitHub Help**: https://docs.github.com/
- **Git Documentation**: https://git-scm.com/doc
- **Interactive Git Tutorial**: https://learngitbranching.js.org/

---

*This guide is based on real-world learning experiences with the CMP Document Converter project. Each scenario represents actual situations encountered during development.*