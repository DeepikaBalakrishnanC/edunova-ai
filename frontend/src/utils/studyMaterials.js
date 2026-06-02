export const STUDY_MATERIALS_KEY = "edunova_study_materials";

export function getStudyMaterials() {
  try {
    const materials = JSON.parse(localStorage.getItem(STUDY_MATERIALS_KEY));
    return Array.isArray(materials) ? materials : [];
  } catch {
    return [];
  }
}

export function saveStudyMaterials(materials) {
  localStorage.setItem(STUDY_MATERIALS_KEY, JSON.stringify(materials));
}
