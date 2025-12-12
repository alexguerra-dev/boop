# Scratch

```bash
# Switch to main and get the latest changes
git checkout main
git pull origin main

# Switch back to development
git checkout development

# Update development to match main (choose one option):

# Option 1: Rebase (keeps cleaner history)
git rebase main

# Option 2: Merge (preserves all history)
git merge main

# Push the updated development branch
git push origin development
```
