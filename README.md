# Raspberry Pi Boot Time Optimization

## Project Overview

This project focuses on reducing the boot time of a Raspberry Pi running 
Linux by analyzing startup services and disabling unnecessary systemd 
services.

The goal is to improve system startup performance while maintaining normal 
desktop functionality.

---

## Objective

* Analyze boot time using systemd tools.
* Identify services causing boot delays.
* Disable unnecessary services.
* Measure boot time before and after optimization.
* Automate optimization using a shell script.

---

## Tools Used

* Raspberry Pi
* Raspberry Pi OS (Linux)
* systemd
* Shell Scripting (Bash)
* Git & GitHub

---

## Commands Used

### Check Overall Boot Time

```bash
systemd-analyze
```

### Find Slow Services

```bash
systemd-analyze blame
```

### Disable Unnecessary Services

```bash
sudo systemctl disable NetworkManager-wait-online.service
sudo systemctl disable cups
sudo systemctl disable avahi-daemon
sudo systemctl disable bluetooth.service
sudo systemctl disable wayvnc.service
```

### Re-enable Services (if required)

```bash
sudo systemctl enable <service_name>
```

---

## Shell Script

The project includes a Bash script (`optimization.sh`) that automates the 
boot optimization process.

Features:

* Displays current boot time.
* Disables unnecessary services.
* Verifies service status.
* Helps automate the optimization workflow.

---

## Results

### Before Optimization

```text
Boot Time: 15.331 seconds
```

### After Optimization

```text
Boot Time: 5.133 seconds
```

### Improvement

```text
15.331s → 5.133s
```

Approximately **66% reduction in boot time**.

---

## Services Optimized

| Service                    | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| NetworkManager-wait-online | Waits for network connection during boot |
| cups                       | Printing service                         |
| avahi-daemon               | Network device discovery service         |
| bluetooth                  | Bluetooth support                        |
| wayvnc                     | Remote desktop (VNC) service             |

---

## Learning Outcomes

Through this project, I learned:

* Linux boot process
* systemd service management
* Shell scripting
* Performance optimization techniques
* Raspberry Pi system administration
* Git and GitHub project management

---

## Future Enhancements

* Kernel optimization
* Device Tree optimization
* Custom Linux image creation using Buildroot
* Bootchart analysis
* Embedded Linux startup profiling

---


