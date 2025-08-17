# Ubiquiti AirMagic CLI

A CLI tool for managing Ubiquiti devices.
Allows selecting devices, entering passwords, and performing automated operations using Puppeteer-Core and the system-installed Chromium.

---

## Prerequisites

Before installing, your system must have:

* Linux (Ubuntu, Debian, or derivatives)
* Git
* Node.js 20+
* Chromium installed (the installation script handles this automatically)

---

## Installation

1. Open a terminal.
2. Run the installation script:

```bash
curl -fsSL https://raw.githubusercontent.com/hermangoncalves/ubiquiti-airmagic-cli/main/scripts/install.sh | bash
```

The script will:

* Check and install Git, Node.js, and Chromium.
* Clone the project from GitHub.
* Install Node.js dependencies.
* Create an `airmagic` alias in your `~/.bashrc`.

3. After the script finishes, load the alias:

```bash
source ~/.bashrc
```

---

## Usage

To start the CLI:

```bash
airmagic
```

The CLI will:

1. Display the list of Ubiquiti devices configured in `~/.airmagic.yaml`.
2. Prompt for the password of the selected device.
3. Execute automated operations using Puppeteer-Core and Chromium.

---

## Configuration

The main configuration file is:

```
~/.airmagic.yaml
```

Example device configuration:

```yaml
app:
  headless: true

network:
  timeout: 60000

devices:
  - name: "Switch Core"
    ip: "192.168.1.10"
    username: "admin"

  - name: "Access Point Sala"
    ip: "192.168.1.20"
    username: "ubnt"

  - name: "EdgeRouter"
    ip: "192.168.1.1"
    username: "admin"
```

> Passwords **should not be saved in this file**. They will be requested during execution.
> To add more devices, simply open `~/.airmagic.yaml` and edit the file.

---

## Notes

* The CLI uses `puppeteer-core` with the system-installed Chromium for maximum compatibility.
* If you encounter issues running `airmagic`, ensure Chromium is installed and in your PATH:

```bash
which chromium-browser
which chromium
```

* To update the CLI in the future:

```bash
cd ~/ubiquiti-airmagic-cli
git pull
npm install --production
```

---

## Contributing

Feel free to open issues or submit pull requests on GitHub.

---

## License

[MIT](LICENSE)
