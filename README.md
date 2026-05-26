# JetNetDNS Monitor

JetNetDNS Monitor is a lightweight Flask dashboard for monitoring the `jetnetdns` Pi-hole server.

The app is designed to provide a simple read-only status view for the DNS server without replacing or modifying the Pi-hole admin interface.

---

## Purpose

This monitor provides quick visibility into:

- Server uptime
- CPU usage
- Memory usage
- Disk usage
- Pi-hole FTL status
- Pi-hole blocking status
- Gravity domain count
- DNS query statistics
- Blocked query statistics

The app is intended to match the style and role of the existing JetNetAI server monitor tools used for systems such as `beach-pi` and `nitro-v`.

---

## Target Host

Production target:

```text
jetnetdns
172.16.4.7
````

Primary role of target host:

```text
Pi-hole DNS server
```

Production app port:

```text
3007
```

---

## Tech Stack

* Python 3.11
* Flask
* psutil
* python-dotenv
* requests
* pymongo

Frontend:

* Server-rendered Jinja templates
* Plain CSS
* Plain JavaScript
* No frontend build system

---

## Project Structure

```text
jetnetdns-monitor/
├── app.py
├── .env
├── .gitignore
├── requirements.txt
├── README.md
├── routes/
│   ├── __init__.py
│   └── status_routes.py
├── services/
│   ├── __init__.py
│   ├── system_service.py
│   ├── pihole_service.py
│   └── mongo_service.py
├── templates/
│   ├── base.html
│   └── dashboard.html
└── static/
    ├── css/
    │   └── styles.css
    ├── img/
    │   └── pihole_logo.svg
    └── js/
        └── dashboard.js
```

---

## Development Setup

Development is done on TeraMax using VS Code.

From the project root:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install flask python-dotenv pymongo psutil requests
python -m pip freeze > requirements.txt
```

Run the app:

```powershell
python app.py
```

Open:

```text
http://127.0.0.1:3007
```

---

## Environment Variables

Create a `.env` file:

```env
APP_ENV=development
APP_PORT=3007

PIHOLE_HOST=172.16.4.7
PIHOLE_USE_MOCK=true
```

### Development Mode

In development mode, Pi-hole stats are mocked:

```env
PIHOLE_USE_MOCK=true
```

This allows local development on TeraMax without requiring Pi-hole commands to exist on Windows.

### Production Mode

On `jetnetdns`, live Pi-hole checks should be enabled:

```env
PIHOLE_USE_MOCK=false
```

The production version is expected to run directly on the Pi-hole host so it can safely execute read-only local Pi-hole status checks.

---

## Routes

| Route         | Purpose                                 |
| ------------- | --------------------------------------- |
| `/`           | Main dashboard                          |
| `/health`     | Simple health check                     |
| `/api/status` | Combined system and Pi-hole status JSON |

---

## Design Notes

The GUI uses the following palette:

```css
--imperial-blue: #0a2463ff;
--blue-bell: #3e92ccff;
--ghost-white: #fffaffff;
--magenta-bloom: #d8315bff;
```

Usage:

* Imperial blue: main shell/nav/text
* Blue bell: healthy/online/status accents
* Ghost white: page background
* Magenta bloom: warning/error/blocked states

The Pi-hole logo is used in the navbar and as the favicon.

---

## Safety Rules

This app should remain read-only.

Do not add dashboard buttons for:

* Restarting Pi-hole
* Disabling blocking
* Updating Gravity
* Rebooting the server
* Running package upgrades
* Changing DNS settings

Those actions should remain manual over SSH because `jetnetdns` is core network infrastructure.

---

## Current Development Status

Implemented:

* Flask app factory pattern
* Dashboard page
* `/health`
* `/api/status`
* Local system stats via `psutil`
* Mock Pi-hole status provider
* CSS theme
* Pi-hole logo in navbar
* Pi-hole logo favicon

Pending:

* Live Pi-hole API/stat integration
* MongoDB snapshot logging
* Production systemd service
* Gunicorn deployment on `jetnetdns`
* Optional Cloudflare/private access route
* README screenshots

---

## Deployment Plan

Target deployment path on `jetnetdns`:

```text
/mnt/apps/jetnetdns-monitor
```

Recommended production process:

```text
gunicorn
systemd
```

Production port:

```text
3007
```

Suggested service name:

```text
jetnetdns-monitor.service
```

---

## Basic Production Checks

After deployment:

```bash
curl http://127.0.0.1:3007/health
curl http://127.0.0.1:3007/api/status
pihole status
systemctl status pihole-FTL --no-pager
```

Expected health response:

```text
OK
```

---

## Notes

The Pi-hole server was updated on Debian 12 Bookworm and confirmed healthy after package upgrades.

Confirmed Pi-hole state:

```text
FTL listening on port 53
Pi-hole blocking enabled
Gravity rebuilt successfully
241,167 unique domains
No reboot required
```