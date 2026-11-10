const form = document.getElementById('age-form');
const dateInput = document.getElementById('birth-date');
const errorMessage = document.getElementById('error-message');
const results = document.getElementById('results');
document.getElementById('year-now').textContent = new Date().getFullYear();

function dateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function addYearsClamped(date, years) {
  const day = Math.min(date.getDate(), daysInMonth(date.getFullYear() + years, date.getMonth()));
  return new Date(date.getFullYear() + years, date.getMonth(), day);
}
function addMonthsClamped(date, months) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  target.setDate(Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth())));
  return target;
}
function diffAge(birth, today) {
  let years = today.getFullYear() - birth.getFullYear();
  let cursor = addYearsClamped(birth, years);
  if (cursor > today) { years--; cursor = addYearsClamped(birth, years); }
  let months = 0;
  while (months < 11) {
    const next = addMonthsClamped(cursor, 1);
    if (next > today) break;
    cursor = next;
    months++;
  }
  const days = Math.round((today - cursor) / 86400000);
  return { years, months, days };
}
function nextBirthday(birth, today) {
  let year = today.getFullYear();
  let next = new Date(year, birth.getMonth(), Math.min(birth.getDate(), daysInMonth(year, birth.getMonth())));
  if (next < today) {
    year++;
    next = new Date(year, birth.getMonth(), Math.min(birth.getDate(), daysInMonth(year, birth.getMonth())));
  }
  return next;
}
function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', { day:'numeric', month:'long', year:'numeric' }).format(date);
}
function showAge(birth) {
  const today = dateOnly(new Date());
  const age = diffAge(birth, today);
  const totalDays = Math.round((today - birth) / 86400000);
  const next = nextBirthday(birth, today);
  const daysLeft = Math.round((next - today) / 86400000);
  document.getElementById('years').textContent = age.years;
  document.getElementById('months').textContent = age.months;
  document.getElementById('days').textContent = age.days;
  document.getElementById('total-days').textContent = totalDays.toLocaleString('en-IN');
  document.getElementById('total-weeks').textContent = Math.floor(totalDays / 7).toLocaleString('en-IN');
  document.getElementById('birth-weekday').textContent = new Intl.DateTimeFormat('en-IN', { weekday:'long' }).format(birth);
  document.getElementById('next-birthday').textContent = formatDate(next);
  document.getElementById('countdown').textContent = daysLeft === 0 ? 'Today — happy birthday!' : `${daysLeft.toLocaleString('en-IN')} day${daysLeft === 1 ? '' : 's'} to go`;
  results.hidden = false;
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  errorMessage.textContent = '';
  if (!dateInput.value) { errorMessage.textContent = 'Please select your date of birth.'; return; }
  const [year, month, day] = dateInput.value.split('-').map(Number);
  const birth = new Date(year, month - 1, day);
  const today = dateOnly(new Date());
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) {
    errorMessage.textContent = 'Please enter a valid date.'; return;
  }
  if (birth > today) { errorMessage.textContent = 'Date of birth cannot be in the future.'; results.hidden = true; return; }
  showAge(birth);
});
document.getElementById('reset-button').addEventListener('click', () => {
  form.reset(); results.hidden = true; errorMessage.textContent = ''; dateInput.focus();
});
