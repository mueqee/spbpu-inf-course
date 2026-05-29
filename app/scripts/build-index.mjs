import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '..');
const CONTENT_ROOT = path.resolve(APP_ROOT, '..');
const OUT_FILE = path.join(APP_ROOT, 'src', 'data', 'content-index.json');

const SOLUTION_DIRS = ['Решение', 'Решения'];
const RAW_BASE =
  'https://raw.githubusercontent.com/mueqee/spbpu-inf-course/2026';

function parseTaskId(folderName) {
  const match = folderName.match(/^Задание_(\d+(?:_\d+)*)_/);
  if (!match) return null;
  return match[1].replace(/_/g, '-');
}

function parseTitle(markdown) {
  const line = markdown.split('\n').find((l) => l.startsWith('# '));
  if (!line) return 'Без названия';
  return line.replace(/^#\s+/, '').trim();
}

function parsePyFile(filePath, folder, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const docMatch =
    content.match(/^"""([\s\S]*?)"""/m) || content.match(/^'''([\s\S]*?)'''/m);
  const docstring = docMatch ? docMatch[1].trim() : '';
  const answerMatch = docstring.match(/Ответ:\s*(.+)/);
  const id = path.basename(fileName, path.extname(fileName));

  const dir = path.dirname(filePath);
  const dataFiles = fs
    .readdirSync(dir)
    .filter(
      (f) =>
        f.startsWith(id) &&
        /\.(txt|ods|csv)$/i.test(f) &&
        f !== fileName
    );

  return {
    id,
    file: path.relative(CONTENT_ROOT, filePath).replace(/\\/g, '/'),
    docstring,
    answer: answerMatch ? answerMatch[1].trim() : null,
    code: content,
    dataFiles: dataFiles.map((f) => ({
      name: f,
      url: `${RAW_BASE}/${folder}/${SOLUTION_DIRS.find((d) => fs.existsSync(path.join(CONTENT_ROOT, folder, d, f))) || 'Решение'}/${f}`,
    })),
  };
}

function findSolutions(folderPath, folder) {
  for (const dirName of SOLUTION_DIRS) {
    const solDir = path.join(folderPath, dirName);
    if (!fs.existsSync(solDir)) continue;
    return fs
      .readdirSync(solDir)
      .filter((f) => /\.py$/i.test(f))
      .sort()
      .map((f) => parsePyFile(path.join(solDir, f), folder, f));
  }
  return [];
}

function scanTasks() {
  const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
  const tasks = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('Задание_')) continue;

    const id = parseTaskId(entry.name);
    if (!id) continue;

    const folderPath = path.join(CONTENT_ROOT, entry.name);
    const readmePath = path.join(folderPath, 'README.md');
    const hasTheory = fs.existsSync(readmePath);
    const theoryMarkdown = hasTheory ? fs.readFileSync(readmePath, 'utf8') : '';
    const solutions = findSolutions(folderPath, entry.name);

    tasks.push({
      id,
      folder: entry.name,
      title: hasTheory ? parseTitle(theoryMarkdown) : entry.name,
      hasTheory,
      theoryMarkdown,
      solutions,
      githubUrl: `https://github.com/mueqee/spbpu-inf-course/tree/2026/${entry.name}`,
    });
  }

  return tasks.sort((a, b) => {
    const na = Number(a.id.split('-')[0]);
    const nb = Number(b.id.split('-')[0]);
    return na - nb || a.id.localeCompare(b.id);
  });
}

function main() {
  const taxonomy = JSON.parse(
    fs.readFileSync(path.join(APP_ROOT, 'data', 'taxonomy.json'), 'utf8')
  );
  const externalCourses = JSON.parse(
    fs.readFileSync(path.join(APP_ROOT, 'data', 'external-courses.json'), 'utf8')
  );

  const tasks = scanTasks();
  const taskIds = new Set(tasks.map((t) => t.id));

  for (const block of taxonomy.blocks) {
    for (const tid of block.taskIds) {
      if (!taskIds.has(tid)) {
        console.warn(`⚠ Папка для задания ${tid} не найдена`);
      }
    }
  }

  const index = {
    generatedAt: new Date().toISOString(),
    meta: {
      title: 'ЕГЭ Информатика 2026',
      subtitle: 'Подготовительные курсы СПбПУ',
      contentRoot: CONTENT_ROOT,
    },
    blocks: taxonomy.blocks,
    tasks,
    externalCourses: externalCourses.resources,
    stats: {
      taskCount: tasks.length,
      solutionCount: tasks.reduce((s, t) => s + t.solutions.length, 0),
      theoryCount: tasks.filter((t) => t.hasTheory).length,
    },
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(index, null, 2), 'utf8');
  console.log(
    `✓ content-index.json: ${index.stats.taskCount} тем, ${index.stats.solutionCount} решений`
  );
}

main();
