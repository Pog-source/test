const panels = document.querySelectorAll('.panel[data-section]');
const output = document.getElementById('notes');

function getFieldValue(field) {
  const selected = field.querySelectorAll('.chip.selected');
  const values = [...selected].map((chip) => chip.textContent.trim());
  if (!values.length) return null;

  const type = field.dataset.type || 'single';
  const key = field.dataset.key ?? '';
  const prefix = field.dataset.prefix;

  let text;
  if (type === 'multi') {
    const joiner = field.dataset.join || ', ';
    text = values.join(joiner);
  } else {
    text = values[0];
  }

  if (prefix === '') return text;
  if (!key) return text;
  return `${key}: ${text}`;
}

function buildNotes() {
  const sections = [];

  panels.forEach((panel) => {
    const sectionTitle = panel.dataset.section;
    const lines = [];

    const fixed = panel.querySelector('.fixed-line');
    if (fixed) lines.push(fixed.textContent.trim());

    panel.querySelectorAll('.field').forEach((field) => {
      const value = getFieldValue(field);
      if (value) lines.push(value);
    });

    sections.push(`${sectionTitle}:\n${lines.join('\n')}`);
  });

  output.value = sections.join('\n\n');
}

// Toggle behavior
for (const field of document.querySelectorAll('.field')) {
  const type = field.dataset.type || 'single';
  const chips = field.querySelectorAll('.chip');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (type === 'multi') {
        chip.classList.toggle('selected');
      } else {
        chips.forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
      }
      buildNotes();
    });
  });
}

document.getElementById('copyNotes').addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.value);
  const btn = document.getElementById('copyNotes');
  const original = btn.textContent;
  btn.textContent = 'Copied!';
  setTimeout(() => (btn.textContent = original), 1200);
});

buildNotes();
