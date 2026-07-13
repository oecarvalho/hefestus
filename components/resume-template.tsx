import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Helper function to parse markdown bold (**) into inline elements for react-pdf
function parseTextWithBold(text: string) {
  if (!text) return "";
  const parts = text.split("**");
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <Text key={index} style={{ fontWeight: "bold" }}>
          {part}
        </Text>
      );
    }
    return part;
  });
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 32,
    paddingHorizontal: 34,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    lineHeight: 1.45,
    color: "#1F2937",
  },

  // HEADER

  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },

  contactLine: {
    fontSize: 8.5,
    color: "#4B5563",
    lineHeight: 1.4,
  },

  // SECTION

  section: {
    marginBottom: 12,
  },

  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#1E3A8A", // Premium navy blue
    letterSpacing: 0.8,
  },

  text: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.45,
  },

  // EXPERIENCE

  item: {
    marginBottom: 8,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },

  itemTitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#111827",
  },

  period: {
    fontSize: 8.5,
    color: "#6B7280",
  },

  company: {
    fontSize: 8.5,
    color: "#4B5563",
    marginBottom: 3,
  },

  description: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.45,
  },

  // SKILLS

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },

  skill: {
    fontSize: 8,
    paddingVertical: 2.5,
    paddingHorizontal: 5.5,
    borderRadius: 3,
    backgroundColor: "#F1F5F9", // Premium slate gray badge
    color: "#334155", // Slate gray text
    marginRight: 4,
    marginBottom: 4,
  },

  // IDIOMAS
  languagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  languageItem: {
    fontSize: 8.5,
    marginRight: 14,
    marginBottom: 4,
    color: "#374151",
  },
});

interface ResumeData {
  summary: string;

  skills: string[];

  experiences: {
    enterpriseName: string;
    job: string;
    period: string;
    description: string;
  }[];

  projects: {
    projectName: string;
    projectDescription: string;
  }[];

  educations?: {
    institutionName: string;
    title: string;
    period: string;
    description?: string;
  }[];

  languages?: {
    language: string;
    level: string;
  }[];
}

interface ResumeTemplateProps {
  data: ResumeData;

  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    linkedin?: string;
    portfolio?: string;
  };
}

export function ResumeTemplate({
  data,
  personalInfo,
}: ResumeTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.name}>
            {personalInfo.name}
          </Text>

          <Text style={styles.contactLine}>
            {[
              personalInfo.email,
              personalInfo.phoneNumber,
              personalInfo.linkedin,
              personalInfo.portfolio,
            ]
              .filter(Boolean)
              .join("   •   ")}
          </Text>

        </View>

        {/* SUMMARY */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Resumo Profissional
            </Text>
          </View>

          <Text style={styles.text}>
            {parseTextWithBold(data.summary)}
          </Text>

        </View>

        {/* SKILLS */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Competências Técnicas
            </Text>
          </View>

          <View style={styles.skillsContainer}>
            {data.skills.map((skill) => (
              <Text key={skill} style={styles.skill}>
                {skill}
              </Text>
            ))}
          </View>

        </View>

        {/* EXPERIENCE */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Experiência Profissional
            </Text>
          </View>

          {data.experiences.map((exp, idx) => (
            <View key={`${exp.enterpriseName}-${idx}`} style={styles.item}>

              <View style={styles.itemHeader}>

                <Text style={styles.itemTitle}>
                  {exp.job}
                </Text>

                <Text style={styles.period}>
                  {exp.period}
                </Text>

              </View>

              <Text style={styles.company}>
                {exp.enterpriseName}
              </Text>

              <Text style={styles.description}>
                {parseTextWithBold(exp.description)}
              </Text>

            </View>
          ))}

        </View>

        {/* PROJECTS */}

        <View style={styles.section}>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Projetos
            </Text>
          </View>

          {data.projects.map((project, idx) => (
            <View key={`${project.projectName}-${idx}`} style={styles.item}>

              <Text style={styles.itemTitle}>
                {project.projectName}
              </Text>

              <Text style={styles.description}>
                {parseTextWithBold(project.projectDescription)}
              </Text>

            </View>
          ))}

        </View>

        {/* EDUCATION */}

        {data.educations && data.educations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Formação Acadêmica
              </Text>
            </View>
            {data.educations.map((edu, idx) => (
              <View key={idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {edu.title}
                  </Text>
                  <Text style={styles.period}>
                    {edu.period}
                  </Text>
                </View>
                <Text style={styles.company}>
                  {edu.institutionName}
                </Text>
                {edu.description ? (
                  <Text style={styles.description}>
                    {parseTextWithBold(edu.description)}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* LANGUAGES */}

        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Idiomas
              </Text>
            </View>
            <View style={styles.languagesContainer}>
              {data.languages.map((lang, idx) => (
                <Text key={idx} style={styles.languageItem}>
                  <Text style={{ fontWeight: "bold" }}>{lang.language}:</Text> {lang.level}
                </Text>
              ))}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
}