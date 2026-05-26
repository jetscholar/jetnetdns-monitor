import platform
import socket
from datetime import datetime, timezone

import psutil


def get_system_status():
	boot_time = datetime.fromtimestamp(psutil.boot_time(), tz=timezone.utc)
	memory = psutil.virtual_memory()
	swap = psutil.swap_memory()
	disk = psutil.disk_usage("/")
	net = psutil.net_io_counters()

	return {
		"hostname": socket.gethostname(),
		"platform": platform.platform(),
		"python_version": platform.python_version(),
		"boot_time": boot_time.strftime("%Y-%m-%d %H:%M UTC"),
		"uptime_seconds": int((datetime.now(timezone.utc) - boot_time).total_seconds()),

		"cpu": {
			"usage_percent": psutil.cpu_percent(interval=0.2),
			"logical_cores": psutil.cpu_count(logical=True),
			"physical_cores": psutil.cpu_count(logical=False),
			"temperature_c": get_cpu_temperature(),
			"load_average": get_load_average()
		},

		"memory": {
			"total": memory.total,
			"used": memory.used,
			"available": memory.available,
			"percent": memory.percent
		},

		"disk": {
			"mount": "/",
			"total": disk.total,
			"used": disk.used,
			"free": disk.free,
			"percent": disk.percent
		},

		"swap": {
			"total": swap.total,
			"used": swap.used,
			"free": swap.free,
			"percent": swap.percent
		},

		"network": {
			"bytes_received": net.bytes_recv,
			"bytes_sent": net.bytes_sent,
			"packets_received": net.packets_recv,
			"packets_sent": net.packets_sent
		}
	}


def get_load_average():
	try:
		load_1, load_5, load_15 = psutil.getloadavg()
		return [round(load_1, 2), round(load_5, 2), round(load_15, 2)]
	except (AttributeError, OSError):
		return None


def get_cpu_temperature():
	try:
		temps = psutil.sensors_temperatures()

		if not temps:
			return None

		for sensor_group in temps.values():
			for sensor in sensor_group:
				if sensor.current is not None:
					return round(sensor.current, 1)

		return None
	except (AttributeError, OSError):
		return None