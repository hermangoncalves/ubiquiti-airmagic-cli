#!/bin/bash
set -e

# Settings
REPO_URL="https://github.com/hermangoncalves/ubiquiti-airmagic-cli.git"
INSTALL_DIR="$HOME/ubiquiti-airmagic-cli"
CONFIG_FILE="$HOME/.airmagic.yaml"

echo "🚀 Installing Ubiquiti AirMagic CLI..."

# Check/install Git
if ! command -v git &> /dev/null; then
    echo "Git not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y git
else
    echo "Git already installed: $(git --version)"
fi

# Check/install Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js already installed: $(node -v)"
fi

# Check/install Chromium
if ! command -v chromium-browser &> /dev/null && ! command -v chromium &> /dev/null; then
    echo "Chromium not found. Installing..."
    sudo apt update
    sudo apt install -y chromium-browser || sudo apt install -y chromium
fi

echo 'export PUPPETEER_EXECUTABLE_PATH=$(which chromium-browser || which chromium)' >> ~/.bashrc

# Clone or update repository
if [ -d "$INSTALL_DIR" ]; then
    echo "Project already exists, updating..."
    cd "$INSTALL_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

# Install dependencies
echo "Installing dependencies..."
npm install --production
npm install --save-dev typescript

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Create global alias
ALIAS_CMD="alias airmagic='node $INSTALL_DIR/dist/index.js'"
SHELL_RC=""

if [[ "$SHELL" == */bash ]]; then
    SHELL_RC="$HOME/.bashrc"
elif [[ "$SHELL" == */zsh ]]; then
    SHELL_RC="$HOME/.zshrc"
else
    echo "⚠️ Unsupported shell. You will need to add the alias manually:"
    echo "$ALIAS_CMD"
    exit 1
fi

if ! grep -Fxq "$ALIAS_CMD" "$SHELL_RC"; then
    echo "$ALIAS_CMD" >> "$SHELL_RC"
    echo "✅ Alias added to $SHELL_RC"
else
    echo "Alias already configured."
fi

# Create initial configuration file if it does not exist
if [ ! -f "$CONFIG_FILE" ]; then
    echo "📝 Creating initial configuration file at $CONFIG_FILE..."
    cat <<EOL > "$CONFIG_FILE"
app:
  headless: true

network:
  timeout: 60000

devices:
  - name: "Switch Core"
    ip: "192.168.1.10"
    username: "admin"
  - name: "Access Point"
    ip: "192.168.1.11"
    username: "admin"
EOL
    echo "✅ File $CONFIG_FILE created. You can add more devices by editing this file."
else
    echo "Configuration file $CONFIG_FILE already exists."
fi

echo "💡 To activate the alias, run: source $SHELL_RC"
echo "You can now use: airmagic"
