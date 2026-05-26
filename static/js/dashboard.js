async function loadStatus() {
	const statusPill = document.getElementById("status-pill");

	try {
		const response = await fetch("/api/status");

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();
		const system = data.system;
		const pihole = data.pihole;

		updateSystem(system);
		updatePihole(pihole);

		statusPill.textContent = "Online";
		statusPill.className = "status-pill ok";
	} catch (error) {
		statusPill.textContent = "Offline";
		statusPill.className = "status-pill error";
		console.error("Status load failed:", error);
	}
}


function updateSystem(system) {
	const cpu = system.cpu;
	const memory = system.memory;
	const disk = system.disk;
	const swap = system.swap;
	const network = system.network;

	document.getElementById("summary-cpu").textContent = `${cpu.usage_percent}%`;
	document.getElementById("summary-cpu-sub").textContent = `${cpu.logical_cores} logical cores`;

	document.getElementById("summary-memory").textContent = `${memory.percent}%`;
	document.getElementById("summary-memory-sub").textContent = `${formatBytes(memory.available)} available`;

	document.getElementById("summary-disk").textContent = `${disk.percent}%`;
	document.getElementById("summary-disk-sub").textContent = `${formatBytes(disk.free)} free`;

	document.getElementById("summary-swap").textContent = `${swap.percent}%`;
	document.getElementById("summary-swap-sub").textContent = `${formatBytes(swap.used)} / ${formatBytes(swap.total)}`;

	document.getElementById("hostname").textContent = system.hostname;
	document.getElementById("platform").textContent = system.platform;
	document.getElementById("python-version").textContent = system.python_version;
	document.getElementById("boot-time").textContent = system.boot_time;
	document.getElementById("uptime").textContent = formatUptime(system.uptime_seconds);

	document.getElementById("cpu").textContent = `${cpu.usage_percent}%`;
	document.getElementById("logical-cores").textContent = cpu.logical_cores;
	document.getElementById("physical-cores").textContent = cpu.physical_cores ?? "n/a";
	document.getElementById("cpu-temp").textContent = cpu.temperature_c === null ? "n/a" : `${cpu.temperature_c}°C`;
	document.getElementById("load-average").textContent = cpu.load_average ? cpu.load_average.join(", ") : "n/a";

	document.getElementById("memory-used").textContent = `${formatBytes(memory.used)} / ${formatBytes(memory.total)}`;
	document.getElementById("memory-available").textContent = formatBytes(memory.available);
	document.getElementById("memory").textContent = `${memory.percent}%`;

	document.getElementById("disk-mount").textContent = disk.mount;
	document.getElementById("disk-used").textContent = `${formatBytes(disk.used)} / ${formatBytes(disk.total)}`;
	document.getElementById("disk-free").textContent = formatBytes(disk.free);
	document.getElementById("disk").textContent = `${disk.percent}%`;

	document.getElementById("net-received").textContent = formatBytes(network.bytes_received);
	document.getElementById("net-sent").textContent = formatBytes(network.bytes_sent);
	document.getElementById("packets-received").textContent = Number(network.packets_received).toLocaleString();
	document.getElementById("packets-sent").textContent = Number(network.packets_sent).toLocaleString();

	document.getElementById("swap-used").textContent = `${formatBytes(swap.used)} / ${formatBytes(swap.total)}`;
	document.getElementById("swap").textContent = `${swap.percent}%`;

	setBar("cpu-bar", cpu.usage_percent);
	setBar("memory-bar", memory.percent);
	setBar("disk-bar", disk.percent);
	setBar("swap-bar", swap.percent);
}


function updatePihole(pihole) {
	document.getElementById("ftl").textContent = pihole.ftl_active ? "Active" : "Down";
	document.getElementById("blocking").textContent = pihole.blocking_enabled ? "Enabled" : "Disabled";
	document.getElementById("gravity").textContent = safeNumber(pihole.gravity_domains);
	document.getElementById("queries").textContent = safeNumber(pihole.dns_queries_today);
	document.getElementById("blocked").textContent = safeNumber(pihole.blocked_queries_today);
	document.getElementById("mode").textContent = pihole.mode ?? "unknown";
}


function setBar(elementId, percent) {
	const element = document.getElementById(elementId);

	if (!element) {
		return;
	}

	const safePercent = Number(percent) || 0;
	element.style.width = `${Math.min(Math.max(safePercent, 0), 100)}%`;

	element.classList.remove("warn", "bad");

	if (safePercent >= 90) {
		element.classList.add("bad");
	} else if (safePercent >= 75) {
		element.classList.add("warn");
	}
}


function safeNumber(value) {
	if (value === null || value === undefined) {
		return "n/a";
	}

	return Number(value).toLocaleString();
}


function formatBytes(bytes) {
	if (bytes === null || bytes === undefined) {
		return "n/a";
	}

	if (bytes === 0) {
		return "0 B";
	}

	const units = ["B", "KiB", "MiB", "GiB", "TiB"];
	const index = Math.floor(Math.log(bytes) / Math.log(1024));
	const value = bytes / Math.pow(1024, index);

	return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}


function formatUptime(seconds) {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	return `${days}d ${hours}h ${minutes}m`;
}


loadStatus();
setInterval(loadStatus, 10000);