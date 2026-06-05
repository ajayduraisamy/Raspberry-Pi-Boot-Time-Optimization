#!/bin/bash

echo "=================================="
echo " Raspberry Pi Boot Optimization "
echo "=================================="

echo ""
echo "Boot time before optimization:"
systemd-analyze

echo ""
echo "Disabling unnecessary services..."

sudo systemctl disable NetworkManager-wait-online.service
sudo systemctl disable cups
sudo systemctl disable avahi-daemon
sudo systemctl disable bluetooth.service
sudo systemctl disable wayvnc.service

echo ""
echo "Services disabled successfully."

echo ""
echo "Current status:"

systemctl is-enabled NetworkManager-wait-online.service
systemctl is-enabled cups
systemctl is-enabled avahi-daemon
systemctl is-enabled bluetooth.service
systemctl is-enabled wayvnc.service

echo ""
echo "Optimization completed."
echo "Please reboot the Raspberry Pi and check:"
echo "systemd-analyze"