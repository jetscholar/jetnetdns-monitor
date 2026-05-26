import socket
import platform
import psutil
from datetime import datetime


def get_system_status():
	boot_time = datetime.fromtimestamp(psutil.boot_time())
	uptime_seconds = int((datetime.now() - boot_time).total_seconds())

	return {
		"hostname": socket.gethostname(),
		"platform": platform.platform(),
		"uptime_seconds": uptime_seconds,
		"cpu_percent": psutil.cpu_percent(interval=0.2),
		"load_average": get_load_average(),
		"memory": {
			"total": psutil.virtual_memory().total,
			"used": psutil.virtual_memory().used,
			"percent": psutil.virtual_memory().percent
		},
		"disk": {
			"total": psutil.disk_usage("/").total,
			"used": psutil.disk_usage("/").used,
			"percent": psutil.disk_usage("/").percent
		}
	}


def get_load_average():
	try:
		return psutil.getloadavg()
	except (AttributeError, OSError):
		return None