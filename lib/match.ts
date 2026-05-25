interface CalculateMatchProps {
  jobSkills: string[]
  curriculumSkills: string[]
}

export function calculateMatch({
  jobSkills,
  curriculumSkills
}: CalculateMatchProps) {

  const normalizedJobSkills =
    jobSkills.map(skill =>
      skill.toLowerCase().trim()
    );

  const normalizedCurriculumSkills =
    curriculumSkills.map(skill =>
      skill.toLowerCase().trim()
    );

  const matchingSkills =
    normalizedJobSkills.filter(skill =>
      normalizedCurriculumSkills.includes(skill)
    );

  const missingSkills =
    normalizedJobSkills.filter(skill =>
      !normalizedCurriculumSkills.includes(skill)
    );

  const matchScore = Math.round(
    (matchingSkills.length /
      normalizedJobSkills.length) * 100
  );

  return {
    matchingSkills,
    missingSkills,
    matchScore
  };
}