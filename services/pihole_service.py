import os
import subprocess


def get_pihole_status():
	use_mock = os.getenv("PIHOLE_USE_MOCK", "true").lower() == "true"

	if use_mock:
		return get_mock_pihole_status()

	return get_live_pihole_status()


def get_mock_pihole_status():
	return {
		"ftl_active": True,
		"blocking_enabled": True,
		"gravity_domains": 241167,
		"dns_queries_today": 0,
		"blocked_queries_today": 0,
		"blocked_percent": 0,
		"last_gravity_update": "dev mock",
		"mode": "development"
	}


def get_live_pihole_status():
	"""
	Initial production-safe implementation.

	This is designed for running directly on jetnetdns later.
	It checks local Pi-hole status without changing anything.
	"""
	status = run_command(["pihole", "status"])

	ftl_active = "FTL is listening on port 53" in status
	blocking_enabled = "Pi-hole blocking is enabled" in status

	return {
		"ftl_active": ftl_active,
		"blocking_enabled": blocking_enabled,
		"gravity_domains": None,
		"dns_queries_today": None,
		"blocked_queries_today": None,
		"blocked_percent": None,
		"last_gravity_update": None,
		"mode": "production-local"
	}


def run_command(command):
	try:
		result = subprocess.run(
			command,
			capture_output=True,
			text=True,
			timeout=5,
			check=False
		)

		return result.stdout + result.stderr
	except Exception as error:
		return str(error)