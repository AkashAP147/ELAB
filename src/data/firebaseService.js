import { database } from '../firebase';
import {
  ref,
  push,
  set,
  get,
  update,
  remove,
  onValue,
  off,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';

// ─── Lab Sections (Subjects) ───────────────────────────────────────────

/**
 * Add a new lab section.
 * @param {{ name: string, code: string, description: string, icon: string, color: string }} labData
 * @returns {Promise<string>} The generated lab ID
 */
export async function addLab(labData) {
  const labsRef = ref(database, 'labs');
  const newLabRef = push(labsRef);
  await set(newLabRef, {
    ...labData,
    createdAt: Date.now(),
  });
  return newLabRef.key;
}

/**
 * Get all labs once.
 * @returns {Promise<Array>}
 */
export async function getAllLabs() {
  const labsRef = ref(database, 'labs');
  const snapshot = await get(labsRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, lab]) => ({ id, ...lab }));
}

/**
 * Subscribe to lab changes in realtime.
 * @param {function} callback
 * @returns {function} unsubscribe function
 */
export function subscribeLabs(callback) {
  const labsRef = ref(database, 'labs');
  const handler = onValue(labsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const labs = Object.entries(data).map(([id, lab]) => ({ id, ...lab }));
    callback(labs);
  });
  return () => off(labsRef, 'value', handler);
}

/**
 * Update a lab section.
 */
export async function updateLab(labId, labData) {
  const labRef = ref(database, `labs/${labId}`);
  await update(labRef, labData);
}

/**
 * Delete a lab section and all its experiments.
 */
export async function deleteLab(labId) {
  // Delete the lab
  const labRef = ref(database, `labs/${labId}`);
  await remove(labRef);
  // Delete all experiments under this lab
  const expRef = ref(database, `experiments/${labId}`);
  await remove(expRef);
}


// ─── Experiments / Programs ────────────────────────────────────────────

/**
 * Add a new experiment/program to a lab.
 * @param {string} labId
 * @param {{ number: string, title: string, description: string, code: string, downloadLink?: string }} expData
 * @returns {Promise<string>}
 */
export async function addExperiment(labId, expData) {
  const expRef = ref(database, `experiments/${labId}`);
  const newExpRef = push(expRef);
  await set(newExpRef, {
    ...expData,
    labId,
    createdAt: Date.now(),
  });
  return newExpRef.key;
}

/**
 * Get all experiments for a specific lab.
 * @param {string} labId
 * @returns {Promise<Array>}
 */
export async function getExperimentsByLab(labId) {
  const expRef = ref(database, `experiments/${labId}`);
  const snapshot = await get(expRef);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data)
    .map(([id, exp]) => ({ id, ...exp }))
    .sort((a, b) => (a.number || '').localeCompare(b.number || '', undefined, { numeric: true }));
}

/**
 * Subscribe to experiments for a lab in realtime.
 * @param {string} labId
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export function subscribeExperiments(labId, callback) {
  const expRef = ref(database, `experiments/${labId}`);
  const handler = onValue(expRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const experiments = Object.entries(data)
      .map(([id, exp]) => ({ id, ...exp }))
      .sort((a, b) => (a.number || '').localeCompare(b.number || '', undefined, { numeric: true }));
    callback(experiments);
  });
  return () => off(expRef, 'value', handler);
}

/**
 * Get a single experiment by its ID and lab ID.
 */
export async function getExperiment(labId, expId) {
  const expRef = ref(database, `experiments/${labId}/${expId}`);
  const snapshot = await get(expRef);
  if (!snapshot.exists()) return null;
  return { id: expId, ...snapshot.val() };
}

/**
 * Find an experiment across all labs by experiment ID.
 */
export async function findExperimentById(expId) {
  const labsSnapshot = await get(ref(database, 'labs'));
  if (!labsSnapshot.exists()) return null;
  
  const labIds = Object.keys(labsSnapshot.val());
  for (const labId of labIds) {
    const expRef = ref(database, `experiments/${labId}/${expId}`);
    const snapshot = await get(expRef);
    if (snapshot.exists()) {
      const lab = labsSnapshot.val()[labId];
      return { id: expId, labId, labName: lab.name, ...snapshot.val() };
    }
  }
  return null;
}

/**
 * Get ALL experiments from ALL labs (for navigation purposes).
 */
export async function getAllExperiments() {
  const labsSnapshot = await get(ref(database, 'labs'));
  if (!labsSnapshot.exists()) return [];

  const labs = labsSnapshot.val();
  const allExperiments = [];

  for (const [labId, labData] of Object.entries(labs)) {
    const expSnapshot = await get(ref(database, `experiments/${labId}`));
    if (expSnapshot.exists()) {
      const exps = expSnapshot.val();
      for (const [expId, expData] of Object.entries(exps)) {
        allExperiments.push({
          id: expId,
          labId,
          labName: labData.name,
          ...expData,
        });
      }
    }
  }

  return allExperiments.sort((a, b) => {
    if (a.labId !== b.labId) return a.labId.localeCompare(b.labId);
    return (a.number || '').localeCompare(b.number || '', undefined, { numeric: true });
  });
}

/**
 * Update an experiment.
 */
export async function updateExperiment(labId, expId, expData) {
  const expRef = ref(database, `experiments/${labId}/${expId}`);
  await update(expRef, expData);
}

/**
 * Delete an experiment.
 */
export async function deleteExperiment(labId, expId) {
  const expRef = ref(database, `experiments/${labId}/${expId}`);
  await remove(expRef);
}


// ─── Seed Data ─────────────────────────────────────────────────────────

/**
 * Seed the database with initial data from the static experiments.js file.
 * Only runs if the 'labs' node is empty.
 */
export async function seedDatabase(staticExperiments) {
  const labsRef = ref(database, 'labs');
  const snapshot = await get(labsRef);
  
  if (snapshot.exists()) {
    // Database already has data, skip seeding
    return false;
  }

  // Define lab metadata
  const labMetadata = {
    'Machine Learning': {
      name: 'Machine Learning',
      code: 'ML',
      description: 'Explore regression, classification, and clustering algorithms.',
      icon: 'Brain',
      color: 'from-blue-500 to-indigo-600',
    },
    'DEVOP': {
      name: 'DEVOP',
      code: 'DEVOP',
      description: 'Development and Operations methodologies, CI/CD, and deployment strategies.',
      icon: 'Server',
      color: 'from-teal-400 to-cyan-600',
    },
  };

  // Create labs
  const labIdMap = {};
  for (const [labName, meta] of Object.entries(labMetadata)) {
    const newLabRef = push(labsRef);
    await set(newLabRef, { ...meta, createdAt: Date.now() });
    labIdMap[labName] = newLabRef.key;
  }

  // Create experiments under their labs
  for (const exp of staticExperiments) {
    const labId = labIdMap[exp.lab];
    if (!labId) continue;

    const expRef = ref(database, `experiments/${labId}`);
    const newExpRef = push(expRef);
    await set(newExpRef, {
      number: exp.number,
      title: exp.title,
      description: exp.description,
      code: exp.code,
      downloadLink: exp.downloadLink || '',
      explanation: exp.explanation || [],
      output: exp.output || [],
      textOutput: exp.textOutput || '',
      labId,
      createdAt: Date.now(),
    });
  }

  return true;
}
