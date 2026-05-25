interface CalculateMatchProps {
  userSkills: string[]
  jobSkills: string[]
}

export function calculeMatch({
  userSkills,
  jobSkills,
}: CalculateMatchProps) {

  if (jobSkills.length === 0) {
    return {
      matchScore: 0,
      matchingSkills: [],
      missingSkills: [],
    }
  }

  const normalizedUserSkills = userSkills.map(
    skill => skill.toLowerCase().trim()
  )

  const normalizedJobSkills = jobSkills.map(
    skill => skill.toLowerCase().trim()
  )

  const matchingSkills = normalizedJobSkills.filter(
    skill => normalizedUserSkills.includes(skill)
  )

  const missingSkills = normalizedJobSkills.filter(
    skill => !normalizedUserSkills.includes(skill)
  )

  const matchScore = Math.round(
    (matchingSkills.length / normalizedJobSkills.length) * 100
  )

  return {
    matchScore,
    matchingSkills,
    missingSkills,
  }
}