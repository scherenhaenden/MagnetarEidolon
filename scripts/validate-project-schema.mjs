import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const PROJECTS_DIR = path.join(REPO_ROOT, 'projects');
const ALLOWED_STATES = new Set([
  'planned',
  'ready',
  'in_progress',
  'in_review',
  'blocked',
  'done',
]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/;

const require = createRequire(import.meta.url);

function loadYaml() {
  try {
    return require(path.join(REPO_ROOT, 'apps', 'magnetar-ui', 'node_modules', 'js-yaml'));
  } catch {
    throw new Error(
      'Unable to load js-yaml from apps/magnetar-ui/node_modules. Run `npm --prefix apps/magnetar-ui install` before validating project schema.',
    );
  }
}

function fail(errors, filePath, message) {
  errors.push(`${path.relative(REPO_ROOT, filePath)}: ${message}`);
}

function expectObject(value, errors, filePath, label) {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    fail(errors, filePath, `${label} must be an object.`);
    return null;
  }

  return value;
}

function expectArray(value, errors, filePath, label) {
  if (!Array.isArray(value) || value.length === 0) {
    fail(errors, filePath, `${label} must be a non-empty array.`);
    return null;
  }

  return value;
}

function expectString(value, errors, filePath, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(errors, filePath, `${label} must be a non-empty string.`);
    return null;
  }

  return value;
}

function expectOptionalString(value, errors, filePath, label) {
  if (value === undefined) {
    return;
  }

  expectString(value, errors, filePath, label);
}

function validateDate(value, errors, filePath, label) {
  const text = expectString(value, errors, filePath, label);
  if (text && !DATE_PATTERN.test(text)) {
    fail(errors, filePath, `${label} must use YYYY-MM-DD format.`);
  }
}

function validateState(value, errors, filePath, label) {
  const text = expectString(value, errors, filePath, label);
  if (text && !ALLOWED_STATES.has(text)) {
    fail(
      errors,
      filePath,
      `${label} must be one of: ${Array.from(ALLOWED_STATES).join(', ')}.`,
    );
  }
}

function validateMetadata(metadata, errors, filePath) {
  const record = expectObject(metadata, errors, filePath, 'metadata');
  if (!record) {
    return;
  }

  expectString(record.project_name, errors, filePath, 'metadata.project_name');
  expectString(record.description, errors, filePath, 'metadata.description');
  const version = expectString(record.version, errors, filePath, 'metadata.version');
  if (version && !VERSION_PATTERN.test(version)) {
    fail(errors, filePath, 'metadata.version must look like a semantic version.');
  }
  validateDate(record.start_date, errors, filePath, 'metadata.start_date');
  expectString(record.repository, errors, filePath, 'metadata.repository');
}

function validateStakeholders(stakeholders, errors, filePath) {
  const entries = expectArray(stakeholders, errors, filePath, 'stakeholders');
  if (!entries) {
    return;
  }

  for (const [index, stakeholder] of entries.entries()) {
    const label = `stakeholders[${index}]`;
    const record = expectObject(stakeholder, errors, filePath, label);
    if (!record) {
      continue;
    }

    expectString(record.name, errors, filePath, `${label}.name`);
    expectString(record.role, errors, filePath, `${label}.role`);
    expectOptionalString(record.contact, errors, filePath, `${label}.contact`);
    expectOptionalString(record.id, errors, filePath, `${label}.id`);
  }
}

function validateMilestones(milestones, errors, filePath) {
  const entries = expectArray(milestones, errors, filePath, 'milestones');
  if (!entries) {
    return;
  }

  for (const [index, milestone] of entries.entries()) {
    const label = `milestones[${index}]`;
    const record = expectObject(milestone, errors, filePath, label);
    if (!record) {
      continue;
    }

    expectString(record.id, errors, filePath, `${label}.id`);
    expectString(record.name, errors, filePath, `${label}.name`);
    validateDate(record.target_date, errors, filePath, `${label}.target_date`);
    expectOptionalString(record.description, errors, filePath, `${label}.description`);
    if (record.status !== undefined) {
      validateState(record.status, errors, filePath, `${label}.status`);
    }
  }
}

function validateTasks(tasks, errors, filePath) {
  const entries = expectArray(tasks, errors, filePath, 'tasks');
  if (!entries) {
    return;
  }

  for (const [index, task] of entries.entries()) {
    const label = `tasks[${index}]`;
    const record = expectObject(task, errors, filePath, label);
    if (!record) {
      continue;
    }

    expectString(record.id, errors, filePath, `${label}.id`);
    expectOptionalString(record.milestone_id, errors, filePath, `${label}.milestone_id`);
    expectString(record.title, errors, filePath, `${label}.title`);
    expectString(record.owner, errors, filePath, `${label}.owner`);

    if (record.state === undefined && record.status === undefined) {
      fail(errors, filePath, `${label} must define either state or status.`);
      continue;
    }

    if (record.state !== undefined) {
      validateState(record.state, errors, filePath, `${label}.state`);
    }

    if (record.status !== undefined) {
      validateState(record.status, errors, filePath, `${label}.status`);
    }
  }
}

function validateRisks(risks, errors, filePath) {
  const entries = expectArray(risks, errors, filePath, 'risks');
  if (!entries) {
    return;
  }

  for (const [index, risk] of entries.entries()) {
    const label = `risks[${index}]`;
    const record = expectObject(risk, errors, filePath, label);
    if (!record) {
      continue;
    }

    expectString(record.id, errors, filePath, `${label}.id`);
    expectString(record.description, errors, filePath, `${label}.description`);
    expectOptionalString(record.probability, errors, filePath, `${label}.probability`);
    expectString(record.impact, errors, filePath, `${label}.impact`);
    expectString(record.mitigation, errors, filePath, `${label}.mitigation`);
  }
}

function validateReporting(reporting, errors, filePath) {
  const record = expectObject(reporting, errors, filePath, 'reporting');
  if (!record) {
    return;
  }

  expectString(record.frequency, errors, filePath, 'reporting.frequency');
  expectString(record.format, errors, filePath, 'reporting.format');
  if (record.status_update_cadence !== undefined) {
    expectString(record.status_update_cadence, errors, filePath, 'reporting.status_update_cadence');
  }
  if (record.bitacora_required !== undefined && typeof record.bitacora_required !== 'boolean') {
    fail(errors, filePath, 'reporting.bitacora_required must be a boolean.');
  }
  if (record.blocker_escalation_sla !== undefined) {
    expectString(record.blocker_escalation_sla, errors, filePath, 'reporting.blocker_escalation_sla');
  }
}

export function validateProjectDocument(document, filePath) {
  const errors = [];
  const record = expectObject(document, errors, filePath, 'document');
  if (!record) {
    return errors;
  }

  for (const key of ['metadata', 'stakeholders', 'milestones', 'tasks', 'risks', 'reporting']) {
    if (!(key in record)) {
      fail(errors, filePath, `Missing required top-level key: ${key}.`);
    }
  }

  validateMetadata(record.metadata, errors, filePath);
  validateStakeholders(record.stakeholders, errors, filePath);
  validateMilestones(record.milestones, errors, filePath);
  validateTasks(record.tasks, errors, filePath);
  validateRisks(record.risks, errors, filePath);
  validateReporting(record.reporting, errors, filePath);

  return errors;
}

export async function collectProjectFiles(projectsDir = PROJECTS_DIR) {
  const entries = await fs.readdir(projectsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.project.yml'))
    .map((entry) => path.join(projectsDir, entry.name))
    .sort();
}

export async function validateProjectFiles(projectFiles) {
  const yaml = loadYaml();
  const errors = [];

  for (const filePath of projectFiles) {
    const source = await fs.readFile(filePath, 'utf8');
    const document = yaml.load(source);
    errors.push(...validateProjectDocument(document, filePath));
  }

  return errors;
}

export async function run() {
  const projectFiles = await collectProjectFiles();
  const errors = await validateProjectFiles(projectFiles);

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`ERROR: ${error}`);
    }

    throw new Error(`Project schema validation failed for ${errors.length} field(s).`);
  }

  console.log(`Validated ${projectFiles.length} project YAML files successfully.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
