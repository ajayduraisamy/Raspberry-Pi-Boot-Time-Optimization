const TerminalDemo = {
  container: null,
  lines: [],
  lineIndex: 0,
  charIndex: 0,
  currentEl: null,
  timer: null,

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.lines = this.getLines();
    this.start();
  },

  getLines() {
    return [
      { type: 'output', text: 'Raspberry Pi Boot Time Optimization', className: 'text-green-400' },
      { type: 'output', text: '==================================', className: 'text-green-400' },
      { type: 'output', text: '' },
      { type: 'cmd', text: 'systemd-analyze' },
      { type: 'output', text: 'Startup finished in 15.331s (kernel) + 8.442s (userspace) = 23.773s', className: 'text-gray-400' },
      { type: 'output', text: '' },
      { type: 'cmd', text: 'systemd-analyze blame | head -5' },
      { type: 'output', text: ' 4.2s NetworkManager-wait-online.service', className: 'text-gray-400' },
      { type: 'output', text: ' 3.1s cups.service', className: 'text-gray-400' },
      { type: 'output', text: ' 2.4s avahi-daemon.service', className: 'text-gray-400' },
      { type: 'output', text: ' 1.8s bluetooth.service', className: 'text-gray-400' },
      { type: 'output', text: ' 1.2s wayvnc.service', className: 'text-gray-400' },
      { type: 'output', text: '' },
      { type: 'cmd', text: 'sudo ./optimization.sh' },
      { type: 'output', text: 'Disabling NetworkManager-wait-online.service... done', className: 'text-green-400' },
      { type: 'output', text: 'Disabling cups.service... done', className: 'text-green-400' },
      { type: 'output', text: 'Disabling avahi-daemon.service... done', className: 'text-green-400' },
      { type: 'output', text: 'Disabling bluetooth.service... done', className: 'text-green-400' },
      { type: 'output', text: 'Disabling wayvnc.service... done', className: 'text-green-400' },
      { type: 'output', text: '✔ All services disabled successfully', className: 'text-green-400' },
      { type: 'output', text: '' },
      { type: 'cmd', text: 'sudo reboot' },
      { type: 'output', text: '... system rebooting ...', className: 'text-blue-400' },
      { type: 'output', text: '' },
      { type: 'cmd', text: 'systemd-analyze' },
      { type: 'output', text: 'Startup finished in 5.133s (kernel) + 2.847s (userspace) = 7.980s', className: 'text-green-400' },
      { type: 'output', text: '' },
      { type: 'output', text: '✔ Boot time reduced by 66.5%!', className: 'text-green-400 font-bold' },
    ];
  },

  typeNext() {
    if (this.lineIndex >= this.lines.length) return;
    const line = this.lines[this.lineIndex];

    if (!this.currentEl) {
      const div = document.createElement('div');
      div.className = 'terminal-line';
      if (line.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = '$ ';
        div.appendChild(prompt);
        const cmd = document.createElement('span');
        cmd.className = 'terminal-cmd';
        this.currentEl = cmd;
        div.appendChild(cmd);
      } else {
        const span = document.createElement('span');
        if (line.className) span.className = line.className;
        this.currentEl = span;
        div.appendChild(span);
      }
      this.container.appendChild(div);
      this.charIndex = 0;
      this.container.scrollTop = this.container.scrollHeight;
    }

    if (this.charIndex < line.text.length) {
      this.currentEl.textContent += line.text[this.charIndex];
      this.charIndex++;
      const delay = line.type === 'cmd' ? 20 : 5;
      this.timer = setTimeout(() => this.typeNext(), delay);
    } else {
      this.currentEl = null;
      this.lineIndex++;
      this.timer = setTimeout(() => this.typeNext(), 150);
    }
  },

  start() {
    this.reset();
    setTimeout(() => this.typeNext(), 500);
  },

  reset() {
    if (this.timer) clearTimeout(this.timer);
    this.container.innerHTML = '';
    this.lineIndex = 0;
    this.charIndex = 0;
    this.currentEl = null;
  },

  restart() {
    this.reset();
    this.start();
  }
};
