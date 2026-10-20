
export const ERROR_MESSAGES = {
  NAME_REQUIRED: 'Le nom est obligatoire.',
  NAME_MIN_LENGTH: 'Le nom doit contenir au moins 3 caractères.',
  NAME_MAX_LENGTH: 'Le nom doit contenir au plus 10 caractères.',

  DESCRIPTION_REQUIRED: 'La description est obligatoire.',
  DESCRIPTION_MIN_LENGTH:
    'La description doit contenir au moins 10 caractères.',
  STATUS_INVALID:
  "Le statut doit être l'une des valeurs : En cours, En attente, Finalisé.",

  TODO_NOT_FOUND: (id: number) => `Le todo ${id} n'existe pas.`,
};