const state = {
  appointments: [
    { name: 'Routine Cleaning', detail: 'Chair 2 · 45 min', style: 'appt-teal' },
    { name: 'Implant Consult', detail: 'Chair 1 · 60 min', style: 'appt-blue' },
    { name: 'Whitening Follow-up', detail: 'Chair 3 · 30 min', style: 'appt-gray' },
  ],
  treatmentSteps: [
    { title: 'Diagnostics', detail: 'Imaging and periodontal review complete.', state: 'complete' },
    { title: 'Restorative Phase', detail: '2 of 3 procedures scheduled.', state: 'progress' },
    { title: 'Retention', detail: 'Awaiting final consultation sign-off.', state: '' },
  ],
  imaging: [
    { name: 'Bitewing Series', style: 'xray' },
    { name: 'Intraoral Scan', style: 'scan' },
    { name: 'Referral PDF', style: 'note' },
  ],
  staff: [
    { title: 'Dr. Singh', detail: 'Operatory · 6 appts' },
    { title: 'Hygiene Team', detail: '2 chairs active' },
    { title: 'Front Desk', detail: 'Response SLA 4m' },
  ],
  messages: [
    { title: 'Reminder Campaign', detail: '18 appointment reminders queued for tomorrow.' },
    { title: 'Post-op Follow-up', detail: '“Thank you for today’s visit” message sent.' },
    { title: 'Missed Call Callback', detail: '3 patients requested scheduling assistance.' },
  ],
  toothStates: ['healthy','treated','healthy','monitor','healthy','healthy','treated','healthy','healthy','monitor','healthy','healthy','treated','healthy','healthy','monitor'],
};

const $ = (id) => document.getElementById(id);

function renderAppointments() {
  $('appointmentsList').innerHTML = state.appointments
    .map((a) => `<div class="appt ${a.style}"><strong>${a.name}</strong><p>${a.detail}</p></div>`)
    .join('');
  $('kpiPatients').textContent = String(31 + state.appointments.length);
}

function renderTeeth() {
  $('teethGrid').innerHTML = state.toothStates
    .map((cls, i) => `<button class="tooth ${cls}" data-index="${i}" title="Click to change status"></button>`)
    .join('');
}

function renderSteps() {
  $('stepsList').innerHTML = state.treatmentSteps
    .map((s) => `<div class="step ${s.state}"><h4>${s.title}</h4><p>${s.detail}</p></div>`)
    .join('');
  $('kpiPlans').textContent = String(state.treatmentSteps.length + 8);
}

function renderBilling() {
  const values = [72, 45, 86, 58, 79];
  $('billingBars').innerHTML = values.map((v) => `<span style="height:${v}%"></span>`).join('');
}

function renderList(key, el, itemTemplate) {
  $(el).innerHTML = state[key].map(itemTemplate).join('');
}

function renderAnalytics() {
  const points = [90, 73, 68, 52, 35, 47, 38, 30, 42, 18];
  const path = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * 300) / (points.length - 1)},${y}`)
    .join(' ');
  $('chartPath').setAttribute('d', path);
}

function bindInteractions() {
  $('navMenu').addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.highlight').forEach((c) => c.classList.remove('highlight'));
    const target = btn.dataset.target;
    const el = document.getElementById(target);
    if (el) {
      el.classList.add('highlight');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  $('teethGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.tooth');
    if (!btn) return;
    const i = Number(btn.dataset.index);
    const next = { healthy: 'treated', treated: 'monitor', monitor: 'healthy' };
    state.toothStates[i] = next[state.toothStates[i]];
    renderTeeth();
  });

  let mode = 'appointment';
  const dialog = $('entryDialog');
  const form = $('entryForm');

  $('newApptBtn').addEventListener('click', () => {
    mode = 'appointment';
    $('dialogTitle').textContent = 'Add New Appointment';
    form.name.value = '';
    form.detail.value = '';
    dialog.showModal();
  });

  $('newPatientBtn').addEventListener('click', () => {
    mode = 'patient';
    $('dialogTitle').textContent = 'Add Patient Profile';
    form.name.value = '';
    form.detail.value = 'Preferred: SMS · Insurance pending';
    dialog.showModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const detail = form.detail.value.trim();
    if (!name || !detail) return;

    if (mode === 'appointment') {
      state.appointments.unshift({ name, detail, style: 'appt-teal' });
      renderAppointments();
    } else {
      $('patientName').textContent = name;
      $('patientInitials').textContent = name.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
      $('patientMeta').textContent = detail;
      $('nextVisit').textContent = 'Pending schedule';
    }
    dialog.close();
  });

  $('runBackupBtn').addEventListener('click', () => {
    $('backupStatusText').textContent = 'Sync in progress…';
    $('backupFill').style.width = '35%';
    setTimeout(() => $('backupFill').style.width = '68%', 400);
    setTimeout(() => $('backupFill').style.width = '100%', 900);
    setTimeout(() => {
      $('backupStatusText').textContent = 'Encrypted sync is healthy.';
      $('backupTime').textContent = 'just now';
      $('backupFill').style.width = '82%';
    }, 1300);
  });

  $('messagesList').addEventListener('click', (e) => {
    const card = e.target.closest('.msg');
    if (!card) return;
    card.classList.toggle('complete');
    card.style.opacity = card.classList.contains('complete') ? '.65' : '1';
  });
}

function init() {
  renderAppointments();
  renderTeeth();
  renderSteps();
  renderBilling();
  renderList('imaging', 'imagingGrid', (i) => `<div class="image-card ${i.style}">${i.name}</div>`);
  renderList('staff', 'staffCards', (s) => `<div><h4>${s.title}</h4><p>${s.detail}</p></div>`);
  renderList('messages', 'messagesList', (m) => `<div class="msg"><strong>${m.title}</strong><p>${m.detail}</p></div>`);
  renderAnalytics();
  bindInteractions();
}

document.addEventListener('DOMContentLoaded', init);
